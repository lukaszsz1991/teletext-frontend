import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function TemplateDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTemplate();
        fetchPages();
    }, [id]);

    const fetchTemplate = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać szczegółów template');
            }

            const data = await response.json();
            setTemplate(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPages = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/pages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const allPages = await response.json();
                // Filtruj strony używające tego template
                const templatePages = allPages.filter(page => {
                    const templateId = page.templateId || (page.template && page.template.id);
                    return templateId === parseInt(id);
                });
                setPages(templatePages);
            }
        } catch (err) {
            console.error('Błąd pobierania stron:', err);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>SZCZEGÓŁY TEMPLATE</h1>
                </div>
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <p>Ładowanie...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error || !template) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>SZCZEGÓŁY TEMPLATE</h1>
                </div>
                <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                    <h3>Błąd</h3>
                    <p>{error || 'Template nie znaleziony'}</p>
                    <button className="btn" onClick={() => navigate('/admin/integrations')} style={{ marginTop: '20px' }}>
                        ← Powrót do listy
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="header">
                <h1>📋 SZCZEGÓŁY TEMPLATE</h1>
                <p>Template ID: {template.id}</p>
            </div>

            <div className="info-section">
                <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>{template.name}</h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>ID:</strong>
                        <span>{template.id}</span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Nazwa:</strong>
                        <span>{template.name}</span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Źródło:</strong>
                        <span>{template.source}</span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Kategoria:</strong>
                        <span>{typeof template.category === 'object' ? template.category.category : template.category}</span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Status:</strong>
                        <span style={{ color: template.active !== false ? '#00ff00' : '#ff0000' }}>
                            {template.active !== false ? '✅ Aktywny' : '❌ Nieaktywny'}
                        </span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Utworzono:</strong>
                        <span>{new Date(template.createdAt).toLocaleString('pl-PL')}</span>
                    </div>

                    <div className="detail-row">
                        <strong style={{ color: '#00aa00' }}>Zaktualizowano:</strong>
                        <span>{new Date(template.updatedAt).toLocaleString('pl-PL')}</span>
                    </div>

                    {template.configJson && Object.keys(template.configJson).length > 0 && (
                        <div className="detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <strong style={{ color: '#00aa00', marginBottom: '10px' }}>Konfiguracja:</strong>
                            <pre style={{
                                backgroundColor: '#0a0a0a',
                                padding: '15px',
                                borderRadius: '4px',
                                border: '1px solid #00aa00',
                                color: '#00ff00',
                                width: '100%',
                                overflow: 'auto'
                            }}>
                                {JSON.stringify(template.configJson, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {pages.length > 0 && (
                <div className="info-section">
                    <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#00ff00' }}>
                        📄 Strony używające tego template ({pages.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {pages.map(page => (
                            <div
                                key={page.id}
                                style={{
                                    padding: '10px 15px',
                                    border: '1px solid #00aa00',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <strong style={{ color: '#00ff00' }}>Strona {page.pageNumber}</strong>
                                    {page.title && <span style={{ marginLeft: '10px', color: '#00aa00' }}>- {page.title}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn btn-small"
                                        onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                                        title="Edytuj stronę"
                                    >
                                        ✏️ Edytuj
                                    </button>
                                    <button
                                        className="btn btn-small"
                                        onClick={() => window.open(`/pages/${page.pageNumber}`, '_blank')}
                                        title="Otwórz integrację w nowej karcie"
                                        style={{
                                            borderColor: '#00ff00',
                                            color: '#00ff00'
                                        }}
                                    >
                                        🔗 Otwórz
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="button-group" style={{ marginTop: '30px' }}>
                <button className="btn" onClick={() => navigate('/admin/integrations')}>
                    ← Powrót do listy
                </button>
                <button className="btn" onClick={() => navigate(`/admin/templates/edit/${template.id}`)}>
                    ✏️ Edytuj
                </button>
            </div>
        </AdminLayout>
    );
}

export default TemplateDetailPage;