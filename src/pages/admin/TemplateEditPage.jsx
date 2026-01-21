import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function TemplateEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [template, setTemplate] = useState({
        name: '',
        source: '',
        category: '',
        configJson: {}
    });
    const [configJsonText, setConfigJsonText] = useState('{}');

    useEffect(() => {
        fetchTemplate();
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
                throw new Error('Nie udało się pobrać danych template');
            }

            const data = await response.json();
            setTemplate(data);
            setConfigJsonText(JSON.stringify(data.configJson || {}, null, 2));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Parsuj JSON config
            let configJson;
            try {
                configJson = JSON.parse(configJsonText);
            } catch (err) {
                throw new Error('Nieprawidłowy format JSON w konfiguracji');
            }

            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: template.name,
                    source: template.source,
                    category: template.category,
                    configJson: configJson
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Błąd podczas zapisywania');
            }

            alert('Template zaktualizowany pomyślnie!');
            navigate('/admin/integrations');
        } catch (err) {
            setError(err.message);
            alert('Błąd: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>EDYCJA TEMPLATE</h1>
                </div>
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <p>Ładowanie...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="header">
                <h1>✏️ EDYCJA TEMPLATE</h1>
                <p>Template ID: {id}</p>
            </div>

            {error && (
                <div className="info-section" style={{ borderColor: '#ff0000', color: '#ff0000', marginBottom: '20px' }}>
                    <strong>Błąd:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="info-section">
                    <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>Podstawowe informacje</h3>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Nazwa template:
                        </label>
                        <input
                            type="text"
                            value={template.name}
                            onChange={(e) => setTemplate({...template, name: e.target.value})}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #00aa00',
                                color: '#00ff00',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Źródło (Source):
                        </label>
                        <select
                            value={template.source}
                            onChange={(e) => setTemplate({...template, source: e.target.value})}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #00aa00',
                                color: '#00ff00',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Wybierz źródło --</option>
                            <option value="EXCHANGE_RATE">Kursy walut (EXCHANGE_RATE)</option>
                            <option value="WEATHER">Pogoda (WEATHER)</option>
                            <option value="NEWS">Wiadomości (NEWS)</option>
                            <option value="LOTTERY">Lotto (LOTTERY)</option>
                            <option value="JOB_OFFERS">Oferty pracy (JOB_OFFERS)</option>
                            <option value="HOROSCOPE">Horoskop (HOROSCOPE)</option>
                            <option value="SPORT_TABLE">Tabela sportowa (SPORT_TABLE)</option>
                            <option value="SPORT_MATCHES">Mecze sportowe (SPORT_MATCHES)</option>
                            <option value="TV_PROGRAM">Program TV (TV_PROGRAM)</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Kategoria:
                        </label>
                        <select
                            value={template.category}
                            onChange={(e) => setTemplate({...template, category: e.target.value})}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #00aa00',
                                color: '#00ff00',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            <option value="FINANCE">FINANCE</option>
                            <option value="WEATHER">WEATHER</option>
                            <option value="NEWS">NEWS</option>
                            <option value="LOTTERY">LOTTERY</option>
                            <option value="JOBS">JOBS</option>
                            <option value="HOROSCOPE">HOROSCOPE</option>
                            <option value="SPORTS">SPORTS</option>
                            <option value="TV">TV</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Konfiguracja JSON:
                        </label>
                        <textarea
                            value={configJsonText}
                            onChange={(e) => setConfigJsonText(e.target.value)}
                            rows={10}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #00aa00',
                                color: '#00ff00',
                                fontSize: '12px',
                                fontFamily: 'monospace'
                            }}
                        />
                        <p style={{ fontSize: '12px', color: '#ffaa00', marginTop: '8px' }}>
                            Wprowadź konfigurację w formacie JSON (np. {`{"currencyCode": "USD", "lastCount": 5}`})
                        </p>
                    </div>
                </div>

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => navigate('/admin/integrations')}
                        disabled={saving}
                    >
                        ← Anuluj
                    </button>
                    <button
                        type="submit"
                        className="btn"
                        disabled={saving}
                        style={{
                            borderColor: saving ? '#555' : '#00ff00',
                            color: saving ? '#555' : '#00ff00',
                            cursor: saving ? 'wait' : 'pointer'
                        }}
                    >
                        {saving ? 'Zapisywanie...' : '💾 Zapisz zmiany'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

export default TemplateEditPage;