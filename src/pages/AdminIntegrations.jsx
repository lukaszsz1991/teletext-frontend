import AdminLayout from '../components/layout/AdminLayout.jsx';
import '../styles/teletext.css';

function AdminIntegrations() {
    return (
        <AdminLayout>
            <div className="header">
                <h1>INTEGRACJE</h1>
                <p>Zarządzanie integracjami zewnętrznymi</p>
            </div>

            <div className="info-section">
                <h3>Dostępne Integracje</h3>
                <p>Lista integracji do wdrożenia (min. 7):</p>
                <ul className="feature-list">
                    <li>Pogoda</li>
                    <li>Wyniki lotto</li>
                    <li>Głosowania w Sejmie</li>
                    <li>Ogłoszenia o pracę</li>
                    <li>Kursy walut</li>
                    <li>Ceny kruszców</li>
                    <li>Wiadomości RSS</li>
                </ul>
            </div>

            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0' }}>
                {`┌────────────────────────────┐
│   W BUDOWIE...             │
│   Konfiguracja integracji  │
│   z zewnętrznymi API       │
└────────────────────────────┘`}
            </div>
        </AdminLayout>
    );
}

export default AdminIntegrations;