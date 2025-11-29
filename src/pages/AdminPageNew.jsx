import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import '../styles/teletext.css';

function AdminPageNew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    return (
        <AdminLayout>
            <div className="header">
                <h1>{isEditMode ? 'EDYTUJ STRONĘ' : 'DODAJ NOWĄ STRONĘ'}</h1>
                <p>{isEditMode ? `Edycja strony ID: ${id}` : 'Tworzenie nowej strony telegazety'}</p>
            </div>

            {isEditMode && (
                <div className="info-section" style={{ borderColor: '#ffaa00', marginBottom: '20px' }}>
                    <h3 style={{ color: '#ffaa00' }}>⚠️ Funkcjonalność w budowie</h3>
                    <p>
                        Kontroler admin do zarządzania stronami nie jest jeszcze zaimplementowany w backendzie.
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        Potrzebne endpointy:
                    </p>
                    <ul className="feature-list">
                        <li>GET /api/admin/pages/{id} - pobranie danych strony</li>
                        <li>PUT /api/admin/pages/{id} - aktualizacja strony</li>
                    </ul>
                </div>
            )}

            <div className="info-section">
                <h3>Formularz {isEditMode ? 'Edycji' : 'Nowej'} Strony</h3>
                <p>Tutaj będzie formularz do {isEditMode ? 'edycji' : 'tworzenia'} stron z polami:</p>
                <ul className="feature-list">
                    <li>Numer strony</li>
                    <li>Tytuł</li>
                    <li>Kategoria</li>
                    <li>Treść (tekst + ASCII art)</li>
                </ul>
            </div>

            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0' }}>
                {`┌────────────────────────────┐
│   W BUDOWIE...             │
│   Formularz ${isEditMode ? 'edycji' : 'tworzenia'}      │
│   ${isEditMode ? 'strony' : 'nowej strony'}             │
└────────────────────────────┘`}
            </div>

            <div className="button-group">
                <button className="btn" onClick={() => navigate('/admin/pages')}>
                    ← Powrót do listy
                </button>
            </div>
        </AdminLayout>
    );
}

export default AdminPageNew;