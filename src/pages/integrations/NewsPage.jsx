import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function NewsPage() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const article = {
                title: data.content.title,
                description: data.content.description,
                link: data.content.additionalData.link,
                pubDate: data.content.additionalData.publicationDate,
                source_id: data.content.additionalData.creator?.[0] || data.content.additionalData.sourceName,
                category: data.content.additionalData.category,
                keywords: data.content.additionalData.keywords
            };

            setNews([article]);
            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania wiadomości:', error);
            setError('Nie udało się pobrać wiadomości');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [pageNumber]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie najnowszych wiadomości...</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error}</p>
                        <button className="btn" onClick={fetchNews} style={{ marginTop: '20px' }}>
                            Spróbuj ponownie
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        {pageNumber} - Najnowsze Wiadomości
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: NEWS | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔══════════════════════════════════╗
║      WIADOMOŚCI Z POLSKI          ║
╚══════════════════════════════════╝`}
                </div>

                <div className="info-section">
                    {news.map((article, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '25px',
                                paddingBottom: '20px',
                                borderBottom: index < news.length - 1 ? '1px solid #003300' : 'none'
                            }}
                        >
                            <h3 style={{
                                fontSize: '18px',
                                marginBottom: '12px',
                                color: '#00ff00',
                                lineHeight: '1.4'
                            }}>
                                ▶ {article.title}
                            </h3>

                            {article.description && (
                                <p style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '15px',
                                    color: '#00dd00'
                                }}>
                                    {article.description}
                                </p>
                            )}

                            <div style={{
                                fontSize: '12px',
                                color: '#00aa00',
                                marginTop: '10px'
                            }}>
                                {article.pubDate && (
                                    <div style={{ marginBottom: '5px' }}>
                                        <span>📅 {formatDate(article.pubDate)}</span>
                                    </div>
                                )}
                                {article.source_id && (
                                    <div style={{ marginBottom: '5px' }}>
                                        <span>📰 Źródło: {article.source_id}</span>
                                    </div>
                                )}
                                {article.keywords && article.keywords.length > 0 && (
                                    <div style={{ marginBottom: '5px' }}>
                                        <span>🏷️ Tagi: {article.keywords.join(', ')}</span>
                                    </div>
                                )}
                                {article.category && article.category.length > 0 && (
                                    <div>
                                        <span>📂 Kategorie: {article.category.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            {article.link && (
                                <div style={{ marginTop: '12px' }}>
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '12px',
                                            color: '#00aaff',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Czytaj więcej →
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        border: '1px solid #00aa00',
                        backgroundColor: '#0a0a0a',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '12px', color: '#00aa00' }}>
                            📡 Dane pobrane z Backend API (Spring Boot)
                        </p>
                        <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '5px' }}>
                            🌐 Źródło: NewsData.io | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                        </p>
                    </div>
                </div>

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchNews}>
                        🔄 Odśwież wiadomości
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default NewsPage;