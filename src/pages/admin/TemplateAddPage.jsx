import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { createTemplate } from '../../services/templateService';
import { getSchemaBySource } from '../../services/schemaService';
import '../../styles/teletext.css';

function TemplateAddPage() {
    const navigate = useNavigate();

    const [template, setTemplate] = useState({
        name: '',
        source: '',
        category: '',
    });
    const [configJsonText, setConfigJsonText] = useState('{}');
    const [schema, setSchema] = useState(null);
    const [loadingSchema, setLoadingSchema] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSourceChange = async (e) => {
        const newSource = e.target.value;
        setTemplate({ ...template, source: newSource });
        setSchema(null);
        setError(null);

        if (!newSource) {
            setConfigJsonText('{}');
            return;
        }

        // Pobierz schemat z backendu
        setLoadingSchema(true);
        try {
            const schemaData = await getSchemaBySource(newSource);
            setSchema(schemaData);

            // Zbuduj przykładowy JSON na podstawie schematu
            const exampleConfig = {};

            // Dodaj wymagane pola
            if (schemaData.required && schemaData.required.length > 0) {
                schemaData.required.forEach(field => {
                    exampleConfig[field] = "";
                });
            }

            setConfigJsonText(JSON.stringify(exampleConfig, null, 2));
        } catch (err) {
            setError('Błąd pobierania schematu: ' + err.message);
            setConfigJsonText('{}');
        } finally {
            setLoadingSchema(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Walidacja JSON
            let configJson;
            try {
                configJson = JSON.parse(configJsonText);
            } catch (err) {
                throw new Error('Pole Konfiguracja musi być poprawnym formatem JSON!');
            }

            // Walidacja wymaganych pól
            if (schema && schema.required) {
                for (const field of schema.required) {
                    if (!configJson[field] || (typeof configJson[field] === 'string' && configJson[field].trim() === '')) {
                        throw new Error(`Pole "${field}" jest wymagane i nie może być puste!`);
                    }
                }
            }

            await createTemplate({
                name: template.name,
                source: template.source,
                category: template.category,
                configJson: configJson
            });

            alert('✅ Integracja dodana pomyślnie!');
            navigate('/admin/integrations');
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="header">
                <h1>➕ NOWA INTEGRACJA</h1>
                <p>Tworzenie nowego szablonu integracji zewnętrznego źródła danych</p>
            </div>

            {error && (
                <div className="info-section" style={{ borderColor: 'red', color: 'red', marginBottom: '20px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="info-section">
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Nazwa integracji (wyświetlana w panelu):
                        </label>
                        <input
                            type="text"
                            required
                            value={template.name}
                            onChange={e => setTemplate({ ...template, name: e.target.value })}
                            placeholder="np. Pogoda Warszawa"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Źródło danych (API):
                        </label>
                        <select
                            required
                            value={template.source}
                            onChange={handleSourceChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Wybierz źródło --</option>
                            <option value="EXCHANGE_RATE">EXCHANGE_RATE (Kursy walut)</option>
                            <option value="WEATHER">WEATHER (Pogoda)</option>
                            <option value="NEWS">NEWS (Wiadomości)</option>
                            <option value="LOTTERY">LOTTERY (Lotto)</option>
                            <option value="JOB_OFFERS">JOB_OFFERS (Oferty pracy)</option>
                            <option value="HOROSCOPE">HOROSCOPE (Horoskop)</option>
                            <option value="SPORT_TABLE">SPORT_TABLE (Tabela sportowa)</option>
                            <option value="SPORT_MATCHES">SPORT_MATCHES (Mecze sportowe)</option>
                            <option value="TV_PROGRAM">TV_PROGRAM (Program TV)</option>
                        </select>
                        {loadingSchema && (
                            <p style={{ fontSize: '11px', color: '#ffaa00', marginTop: '5px' }}>
                                ⏳ Ładowanie schematu...
                            </p>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Kategoria:
                        </label>
                        <select
                            required
                            value={template.category}
                            onChange={e => setTemplate({ ...template, category: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            <option value="NEWS">NEWS (Wiadomości)</option>
                            <option value="SPORTS">SPORTS (Sport)</option>
                            <option value="LOTTERY">LOTTERY (Gry losowe)</option>
                            <option value="TV">TV (Program TV)</option>
                            <option value="WEATHER">WEATHER (Pogoda)</option>
                            <option value="JOBS">JOBS (Oferty pracy)</option>
                            <option value="HOROSCOPE">HOROSCOPE (Horoskop)</option>
                            <option value="FINANCE">FINANCE (Finanse)</option>
                            <option value="MISC">MISC (Różne)</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                            Konfiguracja JSON:
                        </label>
                        <textarea
                            rows="10"
                            value={configJsonText}
                            onChange={e => setConfigJsonText(e.target.value)}
                            placeholder='{"city": "Warsaw"}'
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontFamily: 'monospace',
                                background: '#000',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                fontSize: '12px'
                            }}
                        />
                        {schema && (
                            <div style={{
                                fontSize: '11px',
                                color: '#aa0',
                                marginTop: '8px',
                                padding: '10px',
                                border: '1px dashed #555',
                                borderRadius: '4px',
                                background: '#001100'
                            }}>
                                {schema.required && schema.required.length > 0 && (
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong style={{ color: '#ff5555' }}>⚠️ Wymagane pola:</strong> {schema.required.join(', ')}
                                    </div>
                                )}
                                {schema.optional && schema.optional.length > 0 && (
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong style={{ color: '#55ff55' }}>📋 Opcjonalne pola:</strong> {schema.optional.join(', ')}
                                    </div>
                                )}
                                {schema.types && Object.keys(schema.types).length > 0 && (
                                    <div>
                                        <strong>🔧 Typy pól:</strong>
                                        <div style={{ marginTop: '5px', paddingLeft: '10px' }}>
                                            {Object.entries(schema.types).map(([field, type]) => (
                                                <div key={field}>• {field}: <span style={{ color: '#55aaff' }}>{type}</span></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {!schema && template.source && !loadingSchema && (
                            <p style={{ fontSize: '11px', color: '#aa0', marginTop: '8px' }}>
                                Wprowadź konfigurację w formacie JSON.
                            </p>
                        )}
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
                        disabled={saving || loadingSchema}
                        style={{
                            borderColor: (saving || loadingSchema) ? '#555' : '#00ff00',
                            color: (saving || loadingSchema) ? '#555' : '#00ff00',
                            cursor: (saving || loadingSchema) ? 'wait' : 'pointer'
                        }}
                    >
                        {saving ? 'Zapisywanie...' : '💾 Zapisz integrację'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

export default TemplateAddPage;