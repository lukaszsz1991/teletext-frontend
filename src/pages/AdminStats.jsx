import AdminLayout from '../components/layout/AdminLayout.jsx';
import '../styles/teletext.css';

function AdminStats() {
    return (
        <AdminLayout>
            <div className="header">
                <h1>STATYSTYKI</h1>
                <p>Najczęściej odwiedzane strony</p>
            </div>

            <div className="info-section">
                <h3>Statystyki Odwiedzin</h3>
                <p>Tutaj będą wyświetlane statystyki:</p>
                <ul className="feature-list">
                    <li>Najpopularniejsze strony</li>
                    <li>Liczba odwiedzin</li>
                    <li>Wykresy i raporty</li>
                    <li>Statystyki w czasie rzeczywistym</li>
                </ul>
            </div>

            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0' }}>
                {`┌────────────────────────────┐
│   W BUDOWIE...             │
│   Wykresy i statystyki     │
│   odwiedzin stron          │
└────────────────────────────┘`}
            </div>
        </AdminLayout>
    );
}

export default AdminStats;