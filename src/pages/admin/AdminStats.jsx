import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function AdminStats() {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('current-month');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/stats/pages?size=10&page=1&includeDetails=false`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać statystyk');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getMaxViews = () => {
        if (stats.length === 0) return 1;
        return Math.max(...stats.map(s => s.views));
    };

    const getBarWidth = (views) => {
        const maxViews = getMaxViews();
        return (views / maxViews) * 100;
    };

    const getMedalEmoji = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}.`;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>STATYSTYKI</h1>
                    <p>Najpopularniejsze strony telegazety</p>
                </div>
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <div className="ascii-art" style={{ margin: '30px 0' }}>
                        {`┌──────────────────────────────┐
│   ŁADOWANIE DANYCH...        │
│   Proszę czekać              │
└──────────────────────────────┘`}
                    </div>
                    <p style={{ marginTop: '20px' }}>Pobieranie statystyk z serwera...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>STATYSTYKI</h1>
                    <p>Najpopularniejsze strony telegazety</p>
                </div>
                <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                    <div className="ascii-art" style={{ margin: '30px 0', color: '#ff0000' }}>
                        {`┌──────────────────────────────┐
│   ⚠ BŁĄD POŁĄCZENIA ⚠        │
│   Nie można pobrać danych    │
└──────────────────────────────┘`}
                    </div>
                    <p style={{ marginTop: '20px' }}>{error}</p>
                    <button className="btn" onClick={fetchStats} style={{ marginTop: '20px' }}>
                        Spróbuj ponownie
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const totalViews = stats.reduce((sum, stat) => sum + stat.views, 0);

    return (
        <AdminLayout>
            <div className="header">
                <h1>📊 STATYSTYKI</h1>
                <p>Najpopularniejsze strony telegazety</p>
            </div>

            <div className="button-group" style={{ marginBottom: '30px' }}>
                <button className="btn" onClick={fetchStats}>
                    🔄 Odśwież dane
                </button>
                <button className="btn" onClick={() => navigate('/admin/pages')}>
                    📄 Zarządzaj stronami
                </button>
            </div>

            <div className="info-section" style={{ marginBottom: '30px' }}>
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0' }}>
                    {`╔═══════════════════════════════════╗
║   TOP 10 NAJPOPULARNIEJSZYCH      ║
║        STRON TELEGAZETY           ║
╚═══════════════════════════════════╝`}
                </div>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#00aa00' }}>
                    📅 Zakres: Bieżący miesiąc | 👁️ Łącznie wyświetleń: <strong style={{ color: '#ffff00' }}>{totalViews}</strong>
                </p>
            </div>

            {stats.length === 0 ? (
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <p>Brak danych statystycznych.</p>
                    <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '10px' }}>
                        Statystyki pojawią się po odwiedzeniu stron przez użytkowników.
                    </p>
                </div>
            ) : (
                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <div key={stat.pageNumber} className="stat-card">
                            <div className="stat-rank">
                                <span className="rank-badge">{getMedalEmoji(index)}</span>
                            </div>
                            <div className="stat-content">
                                <div className="stat-header">
                                    <span className="stat-page-number">Strona {stat.pageNumber}</span>
                                    <span className="stat-views">{stat.views} wyświetleń</span>
                                </div>
                                <div className="stat-bar-container">
                                    <div
                                        className="stat-bar"
                                        style={{
                                            width: `${getBarWidth(stat.views)}%`,
                                            backgroundColor: index < 3 ? '#ffff00' : '#00ff00'
                                        }}
                                    >
                                        <span className="stat-bar-label">{Math.round((stat.views / totalViews) * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="stat-actions">
                                <button
                                    className="btn btn-small btn-preview"
                                    onClick={() => window.open(`/pages/${stat.pageNumber}`, '_blank')}
                                    title="Podgląd strony"
                                >
                                    👁️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="info-section" style={{ marginTop: '30px' }}>
                <h3>📈 Podsumowanie</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', border: '2px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                        <div style={{ fontSize: '32px', color: '#ffff00', fontWeight: 'bold', marginBottom: '10px' }}>
                            {stats.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#00aa00' }}>
                            Unikalnych stron
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', border: '2px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                        <div style={{ fontSize: '32px', color: '#ffff00', fontWeight: 'bold', marginBottom: '10px' }}>
                            {totalViews}
                        </div>
                        <div style={{ fontSize: '12px', color: '#00aa00' }}>
                            Łącznie wyświetleń
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', border: '2px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                        <div style={{ fontSize: '32px', color: '#ffff00', fontWeight: 'bold', marginBottom: '10px' }}>
                            {stats[0] ? stats[0].pageNumber : '-'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#00aa00' }}>
                            Najpopularniejsza
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#00aa00' }}>
                    📡 Dane z Backend API (Spring Boot) | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                </p>
            </div>
        </AdminLayout>
    );
}

export default AdminStats;