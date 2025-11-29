import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import '../styles/teletext.css';

function PagesList() {
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        setError(null);

        try {
            // Pobierz wszystkie kategorie
            const categoriesResponse = await apiClient.get('/public/categories');
            const categories = categoriesResponse.data;

            // Dla każdej kategorii pobierz strony
            const allPages = [];
            for (const category of categories) {
                try {
                    const pagesResponse = await apiClient.get(`/public/pages?category=${category.originalName}`);
                    allPages.push(...pagesResponse.data);
                } catch (err) {
                    console.warn(`Nie udało się pobrać stron dla kategorii ${category.originalName}:`, err);
                }
            }

            // Sortowanie po numerze strony (rosnąco)
            const sortedPages = allPages.sort((a, b) => a.pageNumber - b.pageNumber);
            setPages(sortedPages);

        } catch (err) {
            console.error('Błąd podczas pobierania stron:', err);
            setError('Nie udało się pobrać listy stron. Sprawdź połączenie z serwerem.');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (pageNumber) => {
        // Otwórz podgląd w nowej karcie
        window.open(`/page/${pageNumber}`, '_blank');
    };

    const handleEdit = (id) => {
        // Przekierowanie do edycji (placeholder - backend jeszcze nie ma tego endpointu)
        navigate(`/admin/pages/edit/${id}`);
    };

    const handleDeleteClick = (page) => {
        setDeleteConfirm(page);
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm) {
            // Mock usuwania - backend nie ma jeszcze DELETE endpoint
            alert(`Funkcjonalność usuwania jest w budowie.\n\nStrona "${deleteConfirm.title}" (${deleteConfirm.pageNumber}) zostanie usunięta po implementacji backendu.`);
            setDeleteConfirm(null);

            // TODO: Gdy backend będzie gotowy, odkomentować:
            // try {
            //     await apiClient.delete(`/admin/pages/${deleteConfirm.id}`);
            //     fetchPages(); // Odśwież listę
            // } catch (err) {
            //     alert('Błąd podczas usuwania strony');
            // }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="info-section" style={{ textAlign: 'center' }}>
                <div className="ascii-art" style={{ margin: '30px 0' }}>
                    {`┌────────────────────────────┐
│   ŁADOWANIE DANYCH...      │
│   Proszę czekać            │
└────────────────────────────┘`}
                </div>
                <p style={{ marginTop: '20px' }}>Pobieranie listy stron z serwera...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                <div className="ascii-art" style={{ margin: '30px 0', color: '#ff0000' }}>
                    {`┌────────────────────────────┐
│   ⚠ BŁĄD POŁĄCZENIA ⚠      │
│   Nie można pobrać danych  │
└────────────────────────────┘`}
                </div>
                <p style={{ marginTop: '20px' }}>{error}</p>
                <button className="btn" onClick={fetchPages} style={{ marginTop: '20px' }}>
                    Spróbuj ponownie
                </button>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="info-section" style={{ textAlign: 'center' }}>
                <div className="ascii-art" style={{ margin: '30px 0' }}>
                    {`┌────────────────────────────┐
│   BRAK STRON               │
│   Dodaj pierwszą stronę    │
└────────────────────────────┘`}
                </div>
                <p style={{ marginTop: '20px' }}>Nie znaleziono żadnych stron w systemie.</p>
                <button className="btn" onClick={() => navigate('/admin/pages/new')} style={{ marginTop: '20px' }}>
                    Dodaj nową stronę
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Tabela stron */}
            <div className="pages-table-container">
                <table className="pages-table">
                    <thead>
                    <tr>
                        <th>Numer</th>
                        <th>Tytuł</th>
                        <th>Kategoria</th>
                        <th>Ostatnia aktualizacja</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pages.map((page) => (
                        <tr key={page.id}>
                            <td className="page-number">{page.pageNumber}</td>
                            <td className="page-title">{page.title}</td>
                            <td className="page-category">{page.category.category}</td>
                            <td className="page-date">{formatDate(page.updatedAt)}</td>
                            <td className="page-actions">
                                <button
                                    className="btn btn-small btn-preview"
                                    onClick={() => handlePreview(page.pageNumber)}
                                    title="Podgląd strony"
                                >
                                    Podgląd
                                </button>
                                <button
                                    className="btn btn-small btn-edit"
                                    onClick={() => handleEdit(page.id)}
                                    title="Edytuj stronę"
                                >
                                    Edytuj
                                </button>
                                <button
                                    className="btn btn-small btn-delete"
                                    onClick={() => handleDeleteClick(page)}
                                    title="Usuń stronę"
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Podsumowanie */}
            <div className="info-section" style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '12px', textAlign: 'center' }}>
                    Łącznie stron: <strong>{pages.length}</strong> |
                    Sortowanie: <strong>Rosnąco po numerze strony</strong>
                </p>
            </div>

            {/* Modal potwierdzenia usunięcia */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0' }}>
                            {`┌─────────────────────────────────┐
│   ⚠ POTWIERDZENIE USUNIĘCIA ⚠   │
└─────────────────────────────────┘`}
                        </div>
                        <p style={{ textAlign: 'center', margin: '20px 0' }}>
                            Czy na pewno chcesz usunąć stronę?
                        </p>
                        <div className="info-section" style={{ margin: '20px 0' }}>
                            <p><strong>Numer:</strong> {deleteConfirm.pageNumber}</p>
                            <p><strong>Tytuł:</strong> {deleteConfirm.title}</p>
                            <p><strong>Kategoria:</strong> {deleteConfirm.category.category}</p>
                        </div>
                        <div className="button-group" style={{ marginTop: '20px' }}>
                            <button className="btn btn-delete" onClick={handleDeleteConfirm}>
                                Tak, usuń
                            </button>
                            <button className="btn" onClick={handleDeleteCancel}>
                                Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PagesList;