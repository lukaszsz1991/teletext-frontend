import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

function NewsPage() {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = 'pub_0e755a29d1574e1fae3fbe4439adc43d';
            const response = await fetch(
                `https://newsdata.io/api/1/news?apikey=${apiKey}&language=pl&category=top`
            );

            if (!response.ok) {
                throw new Error('Nie udało się pobrać wiadomości');
            }

            const data = await response.json();
            setNews(data.results.slice(0, 10)); // Tylko 10 najnowszych
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

                {/* Nagłówek strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        500 - Najnowsze Wiadomości
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: NEWS | Dane na żywo z NewsData API
                    </p>
                </div>

                {/* ASCII Art */}
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      WIADOMOŚCI Z POLSKI          ║
╚═══════════════════════════════════╝`}
                </div>

                {/* Lista wiadomości */}
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
                                fontSize: '16px',
                                marginBottom: '8px',
                                color: '#00ff00'
                            }}>
                                ► {article.title}
                            </h3>

                            {article.description && (
                                <p style={{
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    marginBottom: '10px',
                                    color: '#00dd00'
                                }}>
                                    {article.description}
                                </p>
                            )}

                            <div style={{
                                fontSize: '11px',
                                color: '#00aa00',
                                marginTop: '8px'
                            }}>
                                {article.pubDate && (
                                    <span>📅 {formatDate(article.pubDate)}</span>
                                )}
                                {article.source_id && (
                                    <span style={{ marginLeft: '15px' }}>
                                        📰 {article.source_id}
                                    </span>
                                )}
                            </div>

                            {article.link && (
                                <div style={{ marginTop: '8px' }}>
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '11px',
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

                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                        <p style={{ fontSize: '12px', color: '#00aa00' }}>
                            Wyświetlono {news.length} najnowszych wiadomości
                        </p>
                        <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '5px' }}>
                            Źródło: NewsData.io
                        </p>
                    </div>
                </div>

                {/* Przyciski nawigacji */}
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