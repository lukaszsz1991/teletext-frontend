import AdminLayout from '../components/layout/AdminLayout';
import '../styles/teletext.css';

function AdminPages() {
    return (
        <AdminLayout>
            <div className="header">
                <h1>STRONY TELEGAZETY</h1>
                <p>Zarządzanie stronami</p>
            </div>

            <div className="info-section">
                <h3>Lista Stron</h3>
                <p>Tutaj będzie lista wszystkich stron telegazety z opcjami edycji i usuwania.</p>
            </div>

            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0' }}>
                {`┌────────────────────────────┐
│   W BUDOWIE...             │
│   Funkcjonalność CRUD      │
│   dla stron telegazety     │
└────────────────────────────┘`}
            </div>
        </AdminLayout>
    );
}

export default AdminPages;