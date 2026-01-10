import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageByNumber } from '../services/api';
import Scanlines from '../components/layout/Scanlines';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/teletext.css';

function PageViewPage() {
    const { pageNumber } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPage();
    }, [pageNumber]);

    const fetchPage = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getPageByNumber(pageNumber);
            setPage(data);
        } catch (err) {
            setError('Nie udało się pobrać strony. Sprawdź numer strony.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie strony {pageNumber}...</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error || !page) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error || 'Strona nie została znaleziona'}</p>
                        <button className="btn" onClick={() => navigate('/pages')} style={{ marginTop: '20px' }}>
                            Powrót do listy stron
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    // Obsługa różnych struktur content
    const getTitle = () => {
        if (typeof page.content === 'object' && page.content.title) {
            return page.content.title;
        }
        return page.title || 'Bez tytułu';
    };

    const getDescription = () => {
        if (typeof page.content === 'object' && page.content.description) {
            return page.content.description;
        }
        return page.description || null;
    };

    const getContentToDisplay = () => {
        // Jeśli content jest stringiem - zwróć go
        if (typeof page.content === 'string') {
            return page.content;
        }

        // Jeśli content jest obiektem z additionalData - zwróć je
        if (typeof page.content === 'object' && page.content.additionalData) {
            return page.content.additionalData;
        }

        // Dla stron MANUAL bez dodatkowej treści
        if (typeof page.content === 'object' && page.content.source === 'manual') {
            return null; // Pokaże info placeholder
        }

        return null;
    };

    const contentToDisplay = getContentToDisplay();
    const description = getDescription();

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                {/* Numer i tytuł strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        {page.pageNumber} - {getTitle()}
                    </h2>
                    {description && (
                        <p style={{ fontSize: '13px', color: '#00aaaa', fontStyle: 'italic', marginBottom: '10px' }}>
                            {description}
                        </p>
                    )}
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: {typeof page.category === 'object' ? page.category.category : page.category}
                    </p>
                    {page.type && (
                        <p style={{ fontSize: '11px', color: '#007700', marginTop: '5px' }}>
                            Typ: {page.type}
                        </p>
                    )}
                </div>

                {/* Treść strony */}
                <div className="info-section">
                    {contentToDisplay ? (
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            fontFamily: 'Courier New, monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#00dd00'
                        }}>
{contentToDisplay}
                        </pre>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #00aa00' }}>
                            <p style={{ color: '#00aa00', fontSize: '14px', marginBottom: '10px' }}>
                                📄 Strona typu MANUAL
                            </p>
                            <p style={{ color: '#007700', fontSize: '12px' }}>
                                Strona została utworzona przez administratora
                            </p>
                            {page.content?.createdAt && (
                                <p style={{ fontSize: '11px', color: '#005500', marginTop: '10px' }}>
                                    Utworzono: {new Date(page.content.createdAt).toLocaleString('pl-PL')}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default PageViewPage;