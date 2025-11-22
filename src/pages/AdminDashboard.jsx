import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import '../styles/teletext.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Sprawdź czy użytkownik jest zalogowany
        const token = localStorage.getItem('jwt_token');
        const email = localStorage.getItem('user_email');

        if (!token) {
            // Jeśli brak tokena, przekieruj do logowania
            navigate('/admin/login');
        } else {
            setUserEmail(email || 'Administrator');
        }
    }, [navigate]);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="header">
                <h1>DASHBOARD</h1>
                <p>Panel główny administratora</p>
            </div>

            {/* ASCII Art */}
            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0' }}>
                {`╔═════════════════════════════════════════╗
║     PANEL ADMINISTRATORA AKTYWNY        ║
║                                         ║
║     ✓ Zalogowano pomyślnie              ║
║     ✓ Sesja aktywna                     ║
║     ✓ Uprawnienia: ADMINISTRATOR        ║
╚═════════════════════════════════════════╝`}
            </div>

            {/* Grid z opcjami */}
            <div className="main-grid">
                <div className="card">
                    <h2>📄 Zarządzanie Stronami</h2>
                    <p>Twórz, edytuj i usuwaj strony telegazety</p>
                    <div className="button-group">
                        <button className="btn">Lista Stron</button>
                        <button className="btn">Nowa Strona</button>
                    </div>
                </div>

                <div className="card">
                    <h2>🔗 Integracje</h2>
                    <p>Zarządzaj integracjami z zewnętrznymi źródłami</p>
                    <div className="button-group">
                        <button className="btn">Pogoda</button>
                        <button className="btn">Waluty</button>
                    </div>
                </div>

                <div className="card">
                    <h2>📊 Statystyki</h2>
                    <p>Najpopularniejsze strony i statystyki odwiedzin</p>
                    <div className="button-group">
                        <button className="btn">Zobacz Stats</button>
                    </div>
                </div>

                <div className="card">
                    <h2>⚙️ Ustawienia</h2>
                    <p>Konfiguracja systemu i parametry</p>
                    <div className="button-group">
                        <button className="btn">Ustawienia</button>
                    </div>
                </div>
            </div>

            {/* Status systemowy */}
            <div className="info-section">
                <h3>Status Systemu</h3>
                <ul className="feature-list">
                    <li>Backend: Połączono</li>
                    <li>Baza danych: Aktywna</li>
                    <li>Integracje: 7/7 działających</li>
                    <li>Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="footer">
                <p>TELEGAZETA © 2025 | SYSTEM ZARZĄDZANIA</p>
                <p>SESJA ADMINA: AKTYWNA</p>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;