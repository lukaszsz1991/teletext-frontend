import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { createPage } from '../services/api';
import '../styles/teletext.css';

function AdminPageNew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        pageNumber: '',
        title: '',
        category: 'MISC',
        description: '',
        content: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.pageNumber) {
            newErrors.pageNumber = 'Numer strony jest wymagany';
        } else {
            const pageNum = parseInt(formData.pageNumber);
            if (isNaN(pageNum) || pageNum < 900 || pageNum > 999) {
                newErrors.pageNumber = 'Numer strony musi być od 900 do 999 (kategoria MISC)';
            }
        }

        if (!formData.title || formData.title.trim().length < 3) {
            newErrors.title = 'Tytuł musi zawierać minimum 3 znaki';
        } else if (formData.title.length > 50) {
            newErrors.title = 'Tytuł może zawierać maksymalnie 50 znaków';
        }

        if (!formData.description || formData.description.trim().length === 0) {
            newErrors.description = 'Opis strony jest wymagany';
        }

        if (!formData.content || formData.content.trim().length === 0) {
            newErrors.content = 'Treść strony jest wymagana';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const pageData = {
                type: 'MANUAL',
                pageNumber: parseInt(formData.pageNumber),
                title: formData.title.trim(),
                category: formData.category,
                description: formData.description.trim(),
                content: formData.content
            };

            await createPage(pageData);
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/admin/pages');
            }, 2000);

        } catch (error) {
            console.error('Error creating page:', error);
            const errorMsg = error.response?.data?.detail || error.message || 'Wystąpił błąd podczas tworzenia strony';
            alert('Błąd: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/pages');
    };

    return (
        <AdminLayout>
            <div className="header">
                <h1>{isEditMode ? 'EDYTUJ STRONĘ' : 'DODAJ NOWĄ STRONĘ'}</h1>
                <p>{isEditMode ? `Edycja strony ID: ${id}` : 'Tworzenie nowej strony telegazety'}</p>
            </div>

            {/* Ważna informacja o ograniczeniach */}
            <div className="info-section" style={{ borderColor: '#ffaa00', marginBottom: '20px', backgroundColor: '#2a2a0a' }}>
                <h3 style={{ color: '#ffaa00' }}>ℹ️ Ważne informacje</h3>
                <ul className="feature-list">
                    <li>Strony MANUAL mogą być tworzone tylko w kategorii <strong>MISC (Różne)</strong></li>
                    <li>Dostępny zakres numerów: <strong>900-999</strong></li>
                    <li>Wszystkie pola są obowiązkowe</li>
                </ul>
            </div>

            {showSuccess && (
                <div className="info-section" style={{ borderColor: '#00ff00', marginBottom: '20px' }}>
                    <h3 style={{ color: '#00ff00' }}>✓ Sukces!</h3>
                    <p>Strona została utworzona pomyślnie. Przekierowywanie do listy stron...</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                    <div>
                        <div className="card">
                            <h2>Dane strony</h2>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    Numer strony (900-999) *
                                </label>
                                <input
                                    type="number"
                                    name="pageNumber"
                                    value={formData.pageNumber}
                                    onChange={handleInputChange}
                                    min="900"
                                    max="999"
                                    className="btn"
                                    style={{ width: '100%', textAlign: 'left', padding: '10px' }}
                                    placeholder="Wpisz numer (np. 950)"
                                />
                                <p style={{ fontSize: '10px', color: '#00aa00', marginTop: '5px' }}>
                                    💡 Przykład: 950, 951, 999
                                </p>
                                {errors.pageNumber && (
                                    <p style={{ color: '#ff0000', fontSize: '11px', marginTop: '5px' }}>
                                        {errors.pageNumber}
                                    </p>
                                )}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    Tytuł strony (max 50 znaków) *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    maxLength="50"
                                    className="btn"
                                    style={{ width: '100%', textAlign: 'left', padding: '10px' }}
                                    placeholder="Wpisz tytuł"
                                />
                                <p style={{ fontSize: '10px', color: '#00aa00', marginTop: '5px' }}>
                                    {formData.title.length}/50 znaków
                                </p>
                                {errors.title && (
                                    <p style={{ color: '#ff0000', fontSize: '11px', marginTop: '5px' }}>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    Kategoria *
                                </label>
                                <div style={{
                                    padding: '10px',
                                    border: '2px solid #00aa00',
                                    backgroundColor: '#0a0a2e',
                                    textAlign: 'center'
                                }}>
                                    <strong style={{ color: '#ffff00', fontSize: '16px' }}>MISC (Różne)</strong>
                                    <p style={{ fontSize: '11px', color: '#00aa00', marginTop: '5px' }}>
                                        Jedyna dostępna kategoria dla stron MANUAL
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    Opis strony *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px',
                                        fontFamily: 'Courier New, monospace',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Krótki opis strony..."
                                />
                                {errors.description && (
                                    <p style={{ color: '#ff0000', fontSize: '11px', marginTop: '5px' }}>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                                    Treść strony (obsługa ASCII art) *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows="12"
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px',
                                        fontFamily: 'Courier New, monospace',
                                        resize: 'vertical',
                                        whiteSpace: 'pre'
                                    }}
                                    placeholder="Wpisz treść strony...&#10;Obsługuje ASCII art i formatowanie."
                                />
                                {errors.content && (
                                    <p style={{ color: '#ff0000', fontSize: '11px', marginTop: '5px' }}>
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            <div className="button-group">
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? 'Zapisywanie...' : '✓ Zapisz'}
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    ✕ Anuluj
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card">
                            <h2>Podgląd strony</h2>

                            <div style={{
                                border: '2px solid #00aa00',
                                padding: '15px',
                                backgroundColor: '#0a0a0a',
                                minHeight: '400px'
                            }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#00ff00',
                                    marginBottom: '10px'
                                }}>
                                    {formData.pageNumber || '___'}
                                </div>

                                <div style={{
                                    fontSize: '18px',
                                    color: '#00dd00',
                                    marginBottom: '10px',
                                    borderBottom: '1px solid #00ff00',
                                    paddingBottom: '10px'
                                }}>
                                    {formData.title || 'Brak tytułu'}
                                </div>

                                <div style={{
                                    fontSize: '12px',
                                    color: '#00aa00',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase'
                                }}>
                                    Kategoria: Różne (MISC)
                                </div>

                                {formData.description && (
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#00aaaa',
                                        marginBottom: '15px',
                                        fontStyle: 'italic'
                                    }}>
                                        {formData.description}
                                    </div>
                                )}

                                <pre style={{
                                    fontFamily: 'Courier New, monospace',
                                    fontSize: '12px',
                                    color: '#00dd00',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    lineHeight: '1.4'
                                }}>
{formData.content || 'Brak treści...'}
                                </pre>
                            </div>

                            <div className="info-section" style={{ marginTop: '15px' }}>
                                <h3 style={{ fontSize: '12px' }}>Wskazówki:</h3>
                                <ul className="feature-list" style={{ fontSize: '11px' }}>
                                    <li>Możesz używać ASCII art</li>
                                    <li>Podgląd aktualizuje się na żywo</li>
                                    <li>Spacje i nowe linie są zachowane</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </form>

        </AdminLayout>
    );
}

export default AdminPageNew;