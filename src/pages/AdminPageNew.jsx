import AdminLayout from '../components/layout/AdminLayout';
import '../styles/teletext.css';

function AdminPageNew() {
    return (
        <AdminLayout>
            <div className="header">
                <h1>DODAJ NOWĄ STRONĘ</h1>
                <p>Tworzenie nowej strony telegazety</p>
            </div>

            <div className="info-section">
                <h3>Formularz Nowej Strony</h3>
                <p>Tutaj będzie formularz do tworzenia nowych stron z polami:</p>
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
│   Formularz tworzenia      │
│   nowej strony             │
└────────────────────────────┘`}
            </div>
        </AdminLayout>
    );
}

export default AdminPageNew;