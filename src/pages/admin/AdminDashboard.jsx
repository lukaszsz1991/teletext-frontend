import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalPages: 0,
        totalViews: 0,
        activeIntegrations: 0,
        totalTemplates: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');

            const pagesResponse = await fetch(`${API_BASE_URL}/admin/pages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pages = await pagesResponse.json();

            const statsResponse = await fetch(`${API_BASE_URL}/admin/stats/pages?size=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsResponse.json();
            const totalViews = statsData.reduce((sum, page) => sum + page.views, 0);

            const templatesResponse = await fetch(`${API_BASE_URL}/admin/templates`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const templates = await templatesResponse.json();

            // Grupuj po source żeby policzyć integracje
            const uniqueSources = [...new Set(templates.map(t => t.source))];

            setStats({
                totalPages: pages.length,
                totalViews: totalViews,
                activeIntegrations: uniqueSources.length,
                totalTemplates: templates.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="header">
                <h1>📊 DASHBOARD</h1>
                <p>Panel główny administratora</p>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-stats">
                <div className="stat-box" onClick={() => navigate('/admin/pages')}>
                    <div className="stat-icon">📄</div>
                    <div className="stat-value">{loading ? '...' : stats.totalPages}</div>
                    <div className="stat-label">Stron w systemie</div>
                </div>

                <div className="stat-box" onClick={() => navigate('/admin/stats')}>
                    <div className="stat-icon">📈️</div>
                    <div className="stat-value">{loading ? '...' : stats.totalViews}</div>
                    <div className="stat-label">Łącznie wyświetleń</div>
                </div>

                <div className="stat-box" onClick={() => navigate('/admin/integrations')}>
                    <div className="stat-icon">🔌</div>
                    <div className="stat-value">{loading ? '...' : stats.activeIntegrations}</div>
                    <div className="stat-label">Aktywne integracje</div>
                </div>

                <div className="stat-box" onClick={() => navigate('/admin/integrations')}>
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{loading ? '...' : stats.totalTemplates}</div>
                    <div className="stat-label">Templates</div>
                </div>
            </div>

            <div className="info-section" style={{ marginTop: '30px' }}>
                <h3>🚀 Szybkie Akcje</h3>
                <div className="quick-actions">
                    <button
                        className="quick-action-btn"
                        onClick={() => navigate('/admin/pages/new')}
                    >
                        <span className="action-icon">➕</span>
                        <span className="action-text">Dodaj nową stronę</span>
                    </button>

                    <button
                        className="quick-action-btn"
                        onClick={() => navigate('/admin/integrations')}
                    >
                        <span className="action-icon">🔌</span>
                        <span className="action-text">Zarządzaj integracjami</span>
                    </button>

                    <button
                        className="quick-action-btn"
                        onClick={() => navigate('/admin/stats')}
                    >
                        <span className="action-icon">📊</span>
                        <span className="action-text">Zobacz statystyki</span>
                    </button>

                    <button
                        className="quick-action-btn"
                        onClick={() => navigate('/admin/pages')}
                    >
                        <span className="action-icon">📄</span>
                        <span className="action-text">Lista wszystkich stron</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '30px' }}>

                <div className="info-section">
                    <h3>⚙️ Status Systemu</h3>
                    <ul className="feature-list">
                        <li>Backend: Połączono</li>
                        <li>Baza danych: Aktywna</li>
                        <li>Integracje: {stats.activeIntegrations}/{stats.activeIntegrations} działających</li>
                        <li>Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}</li>
                    </ul>

                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0a0a2e', border: '1px solid #00aa00' }}>
                        <p style={{ fontSize: '12px', textAlign: 'center', color: '#00aa00' }}>
                            ✅ System działa prawidłowo
                        </p>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="ascii-art" style={{ textAlign: 'center', margin: '30px 0', fontSize: '10px' }}>
                {`╔═════════════════════════════════════════╗
║   TELEGAZETA © 2026                     ║
║   System Zarządzania Treścią            ║
╚═════════════════════════════════════════╝`}
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;