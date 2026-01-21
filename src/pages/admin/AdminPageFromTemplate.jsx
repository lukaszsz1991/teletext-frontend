import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getTemplates, getTemplateById } from '../../services/templateService';
import { getPages, createPageFromTemplate } from '../../services/pageService';
import {
    getOccupiedPageNumbers,
    getFirstFreePageNumberForCategory,
    getCategoryRange,
    isValidPageNumber,
    isPageNumberOccupied
} from '../../utils/pageUtils';
import '../../styles/teletext.css';

function AdminPageFromTemplate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedTemplateId = searchParams.get('templateId');

    const [templates, setTemplates] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [pageNumber, setPageNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (preSelectedTemplateId && templates.length > 0) {
            const template = templates.find(t => t.id === parseInt(preSelectedTemplateId));
            if (template) {
                handleTemplateSelect(template.id);
            }
        }
    }, [preSelectedTemplateId, templates]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [templatesData, pagesData] = await Promise.all([
                getTemplates(),
                getPages()
            ]);

            setTemplates(templatesData);
            setPages(pagesData);
        } catch (err) {
            setError(err.message || 'Nie udało się pobrać danych');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = async (templateId) => {
        if (!templateId) {
            setSelectedTemplate(null);
            return;
        }

        try {
            const template = await getTemplateById(templateId);
            setSelectedTemplate(template);
        } catch (err) {
            setError('Nie udało się pobrać szczegółów szablonu: ' + err.message);
        }
    };

    const handleUseFirstFree = () => {
        if (!selectedTemplate) {
            setError('Najpierw wybierz szablon');
            return;
        }

        const firstFree = getFirstFreePageNumberForCategory(pages, selectedTemplate.category);

        if (firstFree) {
            setPageNumber(firstFree.toString());
            setError(null);

            const range = getCategoryRange(selectedTemplate.category);
            console.log(`Podpowiadam pierwszy wolny numer dla kategorii ${selectedTemplate.category}: ${firstFree} (zakres: ${range.start}-${range.end})`);
        } else {
            const range = getCategoryRange(selectedTemplate.category);
            setError(`Brak wolnych numerów stron w zakresie ${range.start}-${range.end} dla kategorii ${selectedTemplate.category}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (!selectedTemplate) {
                throw new Error('Wybierz szablon');
            }

            if (!isValidPageNumber(pageNumber)) {
                throw new Error('Numer strony musi być w zakresie 101-999');
            }

            if (isPageNumberOccupied(pages, pageNumber)) {
                throw new Error(`Numer strony ${pageNumber} jest już zajęty`);
            }

            await createPageFromTemplate({
                pageNumber: parseInt(pageNumber),
                category: selectedTemplate.category,
                templateId: selectedTemplate.id
            });

            alert(`✅ Strona ${pageNumber} utworzona pomyślnie!`);
            navigate('/admin/pages');
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setSaving(false);
        }
    };

    const groupedTemplates = templates.reduce((acc, template) => {
        const category = template.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(template);
        return acc;
    }, {});

    const occupiedNumbers = getOccupiedPageNumbers(pages);

    if (loading) {
        return (
            <AdminLayout>
                <div className="header">
                    <h1>TWORZENIE STRONY Z SZABLONU</h1>
                </div>
                <div className="info-section" style={{ textAlign: 'center' }}>
                    <p>Ładowanie danych...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="header">
                <h1>📄 NOWA STRONA Z INTEGRACJI</h1>
                <p>Tworzenie strony teletekstu na podstawie szablonu integracji</p>
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
                            Wybierz szablon integracji:
                        </label>
                        <select
                            required
                            value={selectedTemplate?.id || ''}
                            onChange={e => handleTemplateSelect(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">-- Wybierz szablon --</option>
                            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                                <optgroup key={category} label={`━━━ ${category} ━━━`}>
                                    {categoryTemplates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name} ({template.source})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {selectedTemplate && (
                        <>
                            <div className="info-section" style={{ marginBottom: '20px', padding: '15px', background: '#001100' }}>
                                <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Szczegóły szablonu:</h3>
                                <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                                    <div><strong>Nazwa:</strong> {selectedTemplate.name}</div>
                                    <div><strong>Źródło:</strong> {selectedTemplate.source}</div>
                                    <div><strong>Kategoria:</strong> {selectedTemplate.category}</div>
                                    <div><strong>Konfiguracja:</strong></div>
                                    <pre style={{
                                        marginTop: '5px',
                                        padding: '10px',
                                        background: '#000',
                                        border: '1px solid #0f0',
                                        fontSize: '11px',
                                        overflow: 'auto'
                                    }}>
                                        {JSON.stringify(selectedTemplate.configJson, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                                    Numer strony (101-999):
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="number"
                                        required
                                        min="101"
                                        max="999"
                                        value={pageNumber}
                                        onChange={e => setPageNumber(e.target.value)}
                                        placeholder="np. 505"
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: '#000',
                                            color: '#0f0',
                                            border: '1px solid #0f0',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleUseFirstFree}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        🔢 Użyj pierwszego wolnego
                                    </button>
                                </div>
                                <p style={{ fontSize: '11px', color: '#aa0', marginTop: '8px' }}>
                                    {selectedTemplate && (
                                        <>
                                            Zakres dla kategorii {selectedTemplate.category}: {getCategoryRange(selectedTemplate.category).start}-{getCategoryRange(selectedTemplate.category).end}
                                            <br />
                                        </>
                                    )}
                                    Zajęte numery: {occupiedNumbers.length > 0 ? occupiedNumbers.sort((a, b) => a - b).join(', ') : 'Brak'}
                                </p>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#00aa00' }}>
                                    Tytuł strony (dziedziczony z szablonu):
                                </label>
                                <input
                                    type="text"
                                    value={selectedTemplate.name}
                                    disabled
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: '#111',
                                        color: '#888',
                                        border: '1px solid #333',
                                        fontSize: '14px',
                                        cursor: 'not-allowed'
                                    }}
                                />
                                <p style={{ fontSize: '11px', color: '#aa0', marginTop: '5px' }}>
                                    Tytuł i opis są automatycznie pobierane z nazwy szablonu
                                </p>
                            </div>
                        </>
                    )}
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
                        disabled={saving || !selectedTemplate}
                        style={{
                            borderColor: (saving || !selectedTemplate) ? '#555' : '#00ff00',
                            color: (saving || !selectedTemplate) ? '#555' : '#00ff00',
                            cursor: (saving || !selectedTemplate) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {saving ? 'Tworzenie...' : '💾 Utwórz stronę'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

export default AdminPageFromTemplate;