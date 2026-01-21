import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentForSource } from '../config/template-components-mapping';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function TemplatePageWrapper() {
    const { pageNumber } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);
                if (!response.ok) throw new Error('Nie znaleziono strony');
                const data = await response.json();
                console.log('📄 Dane strony z szablonu:', data);
                setPageData(data);
            } catch (err) {
                console.error('❌ Błąd:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [pageNumber]);

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    if (error || !pageData) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title" style={{ color: '#ff0000' }}>
                        ✖ Błąd ładowania strony
                    </h1>
                </div>
                <div className="page-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        border: '2px solid #ff0000',
                        backgroundColor: '#1a0000'
                    }}>
                        <p style={{ fontSize: '16px', color: '#ff6b6b', marginBottom: '20px' }}>
                            {error || 'Nie znaleziono strony'}
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/pages')}
                            style={{ marginTop: '20px' }}
                        >
                            ← Powrót do listy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const source = pageData.content?.source;

    if (!source) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title" style={{ color: '#ff0000' }}>
                        ✖ Brak źródła danych
                    </h1>
                </div>
                <div className="page-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        border: '2px solid #ff0000',
                        backgroundColor: '#1a0000'
                    }}>
                        <p style={{ fontSize: '16px', color: '#ff6b6b' }}>
                            Strona nie ma przypisanego źródła danych
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/pages')}
                            style={{ marginTop: '20px' }}
                        >
                            ← Powrót do listy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const Component = getComponentForSource(source);

    if (!Component) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title" style={{ color: '#ffaa00' }}>
                        ⚠ Nieobsługiwane źródło
                    </h1>
                </div>
                <div className="page-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        border: '2px solid #ffaa00',
                        backgroundColor: '#1a1a00'
                    }}>
                        <p style={{ fontSize: '16px', color: '#ffcc66', marginBottom: '20px' }}>
                            Źródło "{source}" nie ma jeszcze obsługi renderowania
                        </p>
                        <p style={{ fontSize: '12px', color: '#888' }}>
                            Strona {pageNumber}
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/pages')}
                            style={{ marginTop: '20px' }}
                        >
                            ← Powrót do listy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    console.log(`✅ Renderuję komponent dla źródła: ${source}`);
    return <Component />;
}

export default TemplatePageWrapper;
