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

    const renderWeatherContent = (dailyWeathers) => {
        return (
            <div style={{ marginTop: '20px' }}>
                {dailyWeathers.map((day, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderBottom: '1px solid #00aa00',
                            fontFamily: 'Courier New, monospace'
                        }}
                    >
                        <div style={{ flex: 1, color: '#00ff00', fontSize: '14px' }}>
                            📅 {new Date(day.date).toLocaleDateString('pl-PL', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit'
                        })}
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <span style={{ color: '#ff6666', fontSize: '16px', fontWeight: 'bold' }}>
                                ↑ {day.maxTemperature}{day.maxTemperatureUnit}
                            </span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                            <span style={{ color: '#6666ff', fontSize: '16px', fontWeight: 'bold' }}>
                                ↓ {day.minTemperature}{day.minTemperatureUnit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderContent = () => {
        // String content (np. NEWS)
        if (typeof page.content === 'string') {
            return (
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#00dd00'
                }}>
{page.content}
                </pre>
            );
        }

        // Object content
        if (typeof page.content === 'object' && page.content.additionalData) {
            const additionalData = page.content.additionalData;

            // Pogoda - dailyWeathers array
            if (additionalData.dailyWeathers && Array.isArray(additionalData.dailyWeathers)) {
                return renderWeatherContent(additionalData.dailyWeathers);
            }

            // Inne additionalData jako string
            if (typeof additionalData === 'string') {
                return (
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#00dd00'
                    }}>
{additionalData}
                    </pre>
                );
            }

            // Inne obiekty - wyświetl jako JSON (fallback)
            return (
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: '#00dd00'
                }}>
{JSON.stringify(additionalData, null, 2)}
                </pre>
            );
        }

        // MANUAL bez treści
        if (typeof page.content === 'object' && page.content.source === 'manual') {
            return (
                <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #00aa00' }}>
                    <p style={{ color: '#00aa00', fontSize: '14px', marginBottom: '10px' }}>
                        📄 Strona typu MANUAL
                    </p>
                    <p style={{ color: '#007700', fontSize: '12px' }}>
                        Strona została utworzona przez administratora
                    </p>
                    {page.content.createdAt && (
                        <p style={{ fontSize: '11px', color: '#005500', marginTop: '10px' }}>
                            Utworzono: {new Date(page.content.createdAt).toLocaleString('pl-PL')}
                        </p>
                    )}
                </div>
            );
        }

        // Fallback
        return <p style={{ textAlign: 'center', color: '#00aa00' }}>Brak treści</p>;
    };

    const description = getDescription();

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

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

                <div className="info-section">
                    {renderContent()}
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