import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

function JobsPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchKeywords, setSearchKeywords] = useState('developer');
    const [searchLocation, setSearchLocation] = useState('Warsaw');

    useEffect(() => {
        fetchJobs(searchKeywords, searchLocation);
    }, []);

    const fetchJobs = async (keywords, location) => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = 'f34f2a95-bf43-4056-a835-43e68481264a';
            const response = await fetch(`https://jooble.org/api/${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    keywords: keywords,
                    location: location
                })
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać ofert pracy');
            }

            const data = await response.json();
            setJobs(data.jobs.slice(0, 10)); // Maksymalnie 10 ofert
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        // Walidacja - nie pozwalaj na puste pola
        if (!searchKeywords.trim() || !searchLocation.trim()) {
            setError('Wypełnij oba pola wyszukiwania - obowiązuje język angielski');
            return;
        }
        fetchJobs(searchKeywords, searchLocation);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    };

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                {/* Nagłówek strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        600 - Oferty Pracy
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: JOBS | Dane na żywo z Jooble API
                    </p>
                </div>

                {/* ASCII Art */}
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      WYSZUKIWARKA OFERT PRACY     ║
╚═══════════════════════════════════╝`}
                </div>

                {/* Formularz wyszukiwania */}
                <div className="info-section">
                    <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Wyszukaj oferty:</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#00aa00' }}>
                                Stanowisko / Słowa kluczowe:
                            </label>
                            <input
                                type="text"
                                value={searchKeywords}
                                onChange={(e) => setSearchKeywords(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#0a0a0a',
                                    border: '1px solid #00ff00',
                                    color: '#00ff00',
                                    fontSize: '14px'
                                }}
                                placeholder="np. developer, driver"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#00aa00' }}>
                                Lokalizacja:
                            </label>
                            <input
                                type="text"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#0a0a0a',
                                    border: '1px solid #00ff00',
                                    color: '#00ff00',
                                    fontSize: '14px'
                                }}
                                placeholder="np. Warsaw, Krakow, Poland (English)"
                            />
                        </div>
                    </div>
                    <button className="btn" onClick={handleSearch} style={{ width: '100%' }}>
                        🔍 Szukaj ofert
                    </button>
                </div>

                {/* Ładowanie */}
                {loading && (
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Wyszukiwanie ofert pracy...</p>
                    </div>
                )}

                {/* Błąd */}
                {error && (
                    <div className="info-section" style={{ borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error}</p>
                    </div>
                )}

                {/* Lista ofert */}
                {!loading && !error && jobs.length > 0 && (
                    <div className="info-section">
                        <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
                            Znaleziono {jobs.length} ofert:
                        </h3>
                        {jobs.map((job, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '25px',
                                    paddingBottom: '20px',
                                    borderBottom: index < jobs.length - 1 ? '1px solid #003300' : 'none'
                                }}
                            >
                                <h4 style={{
                                    fontSize: '16px',
                                    marginBottom: '8px',
                                    color: '#00ff00'
                                }}>
                                    💼 {job.title}
                                </h4>

                                {job.company && (
                                    <p style={{ fontSize: '14px', marginBottom: '5px', color: '#00dd00' }}>
                                        🏢 {job.company}
                                    </p>
                                )}

                                {job.location && (
                                    <p style={{ fontSize: '13px', marginBottom: '5px', color: '#00aa00' }}>
                                        📍 {job.location}
                                    </p>
                                )}

                                {job.salary && (
                                    <p style={{ fontSize: '13px', marginBottom: '10px', color: '#00ff00', fontWeight: 'bold' }}>
                                        💰 {job.salary}
                                    </p>
                                )}

                                {job.snippet && (
                                    <p style={{
                                        fontSize: '12px',
                                        lineHeight: '1.6',
                                        marginBottom: '10px',
                                        color: '#00cc00'
                                    }}>
                                        {job.snippet}
                                    </p>
                                )}

                                <div style={{ fontSize: '11px', color: '#00aa00', marginBottom: '10px' }}>
                                    {job.updated && (
                                        <span>📅 Opublikowano: {formatDate(job.updated)}</span>
                                    )}
                                </div>

                                {job.link && (

                                    <a href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                    fontSize: '12px',
                                    color: '#00aaff',
                                    textDecoration: 'underline'
                                }}
                                    >
                                    Aplikuj →
                                    </a>
                                    )}
                            </div>
                        ))}

                        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                            <p style={{ fontSize: '12px', color: '#00aa00' }}>
                                Wyświetlono {jobs.length} ofert dla: "{searchKeywords}" w lokalizacji "{searchLocation}"
                            </p>
                            <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '5px' }}>
                                Źródło: Jooble.org
                            </p>
                        </div>
                    </div>
                    )}

                {/* Brak wyników */}
                {!loading && !error && jobs.length === 0 && (
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Nie znaleziono ofert dla podanych kryteriów.</p>
                        <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '10px' }}>
                            Spróbuj zmienić słowa kluczowe lub lokalizację.
                        </p>
                    </div>
                )}

                {/* Przyciski nawigacji */}
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

export default JobsPage;