import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import '../styles/teletext.css';

const API_BASE_URL = window._env_.REACT_APP_API_URL || 'http://localhost:8080/api';

function AdminIntegrations() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const integrationInfo = {
        'EXCHANGE_RATE': { icon: '💱', name: 'Kursy Walut', color: '#ffaa00' },
        'WEATHER': { icon: '🌤️', name: 'Pogoda', color: '#00aaff' },
        'NEWS': { icon: '📰', name: 'Wiadomości', color: '#ff5555' },
        'LOTTERY': { icon: '🎰', name: 'Lotto', color: '#ffff00' },
        'JOB_OFFERS': { icon: '💼', name: 'Oferty Pracy', color: '#aa55ff' },
        'HOROSCOPE': { icon: '🔮', name: 'Horoskop', color: '#ff66ff' },
        'SPORT_TABLE': { icon: '⚽', name: 'Sport - Tabele', color: '#00ff00' },
        'SPORT_MATCHES': { icon: '📅', name: 'Sport - Mecze', color: '#00ff00' },
        'TV_PROGRAM': { icon: '📺', name: 'Program TV', color: '#5555ff' }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/templates`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać listy integracji');
            }

            const data = await response.json();
            setTemplates(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (templateId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten template?')) return;

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Template został usunięty');
                fetchTemplates();
            } else {
                alert('Błąd podczas usuwania template');
            }
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    };

    const handleToggleActive = async (templateId, currentStatus) => {
        try {
            const token = localStorage.getItem('jwt_token');
            const endpoint = currentStatus ?
                `${API_BASE_URL}/admin/templates/${templateId}` :
                `${API_BASE_URL}/admin/templates/${templateId}/activate`;

            const method = currentStatus ? 'DELETE' : 'PATCH';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchTemplates();
            } else {
                alert('Błąd podczas zmiany statusu');
            }
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    };

    const groupedTemplates = templates.reduce((acc, template) => {
        const source = template.source;
        if (!acc[source]) {
            acc[source] = [];
        }
        acc[source].push(template);
        return acc;
    }, {});

    if (loading) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>INTEGRACJE</h1>
                    <p>Zarządzanie integracjami zewnętrznych źródeł</p>
                </div>
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <div className="ascii-art" style={{ margin: '30px 0' }}>
                        {`┌──────────────────────────────┐
│   ŁADOWANIE DANYCH...        │
│   Proszę czekać              │
└──────────────────────────────┘`}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>INTEGRACJE</h1>
                    <p>Zarządzanie integracjami zewnętrznych źródeł</p>
                </div>
                <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                    <h3>Błąd</h3>
                    <p>{error}</p>
                    <button className="btn" onClick={fetchTemplates} style={{ marginTop: '20px' }}>
                        Spróbuj ponownie
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="header">
                <h1>🔌 INTEGRACJE</h1>
                <p>Zarządzanie integracjami zewnętrznych źródeł danych</p>
            </div>

            <div className="button-group" style={{ marginBottom: '30px' }}>
                <button className="btn" onClick={() => navigate('/admin/pages/new')}>
                    ➕ Dodaj nową stronę
                </button>
                <button className="btn" onClick={fetchTemplates}>
                    🔄 Odśwież listę
                </button>
            </div>

            <div className="integrations-grid">
                {Object.entries(groupedTemplates).map(([source, sourceTemplates]) => {
                    const info = integrationInfo[source] || { icon: '🔧', name: source, color: '#00aa00' };
                    const activeCount = sourceTemplates.filter(t => t.active !== false).length;
                    const totalCount = sourceTemplates.length;

                    return (
                        <div key={source} className="integration-card">
                            <div className="integration-header" style={{ borderColor: info.color }}>
                                <div className="integration-icon" style={{ fontSize: '48px' }}>
                                    {info.icon}
                                </div>
                                <div className="integration-title" style={{ color: info.color }}>
                                    {info.name}
                                </div>
                                <div className="integration-status">
                                    {activeCount > 0 ? (
                                        <span style={{ color: '#00ff00' }}>✅ Aktywne</span>
                                    ) : (
                                        <span style={{ color: '#ff0000' }}>❌ Nieaktywne</span>
                                    )}
                                </div>
                                <div className="integration-count">
                                    {totalCount} {totalCount === 1 ? 'template' : 'templates'}
                                </div>
                            </div>

                            <div className="integration-templates">
                                {sourceTemplates.map(template => (
                                    <div key={template.id} className="template-item">
                                        <div className="template-info">
                                            <div className="template-name">{template.name}</div>
                                            <div className="template-category">
                                                Kategoria: {typeof template.category === 'object' ? template.category.category : template.category}
                                            </div>
                                        </div>
                                        <div className="template-actions">
                                            <button
                                                className="btn btn-small btn-preview"
                                                onClick={() => navigate(`/admin/templates/${template.id}`)}
                                                title="Szczegóły"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="btn btn-small btn-edit"
                                                onClick={() => navigate(`/admin/templates/edit/${template.id}`)}
                                                title="Edytuj"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-small"
                                                onClick={() => handleToggleActive(template.id, template.active)}
                                                title={template.active ? "Deaktywuj" : "Aktywuj"}
                                                style={{
                                                    borderColor: template.active ? '#ffaa00' : '#00ff00',
                                                    color: template.active ? '#ffaa00' : '#00ff00'
                                                }}
                                            >
                                                {template.active !== false ? '🔄' : '✅'}
                                            </button>
                                            <button
                                                className="btn btn-small btn-delete"
                                                onClick={() => handleDelete(template.id)}
                                                title="Usuń"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {templates.length === 0 && (
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <p>Brak zdefiniowanych integracji.</p>
                </div>
            )}

            <div className="info-section" style={{ marginTop: '30px' }}>
                <h3>📊 Podsumowanie</h3>
                <p>Łącznie integracji: <strong>{Object.keys(groupedTemplates).length}</strong></p>
                <p>Łącznie templates: <strong>{templates.length}</strong></p>
            </div>
        </AdminLayout>
    );
}

export default AdminIntegrations;