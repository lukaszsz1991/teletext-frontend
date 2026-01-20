import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window.env?.REACT_APP_API_URL || 'http://localhost:8080/api';

function MatchesPage() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [matchesData, setMatchesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);

    const fetchMatchesData = async () => {
        setLoading(true);
        setError(null);
        setWarning(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit przekroczony (HTTP 429) - zbyt wiele zapytań do API. Spróbuj ponownie za kilka minut.');
                }
                if (response.status === 404) {
                    throw new Error(`Strona ${pageNumber} nie istnieje (HTTP 404).`);
                }
                if (response.status === 500) {
                    throw new Error('Błąd serwera (HTTP 500) - nie pobrano danych.');
                }
                throw new Error(`Błąd HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.content || !data.content.additionalData) {
                throw new Error('Brak treści ido wyświetlenia.');
            }

            const matches = data.content.additionalData.Matches || data.content.additionalData.matches;

            if (!matches || matches.length === 0) {
                const warningMsg = !matches
                    ? 'Brak danych z zewnętrznego API (Highlightly). Może to być spowodowane przekroczeniem limitu zapytań lub brakiem meczów w wybranym tygodniu.'
                    : 'Pustą listę meczów lub brak meczów w wybranym tygodniu.';

                console.warn(warningMsg);
                setWarning(warningMsg);
            }

            setMatchesData({
                pageNumber: data.pageNumber,
                title: data.content.title,
                description: data.content.description,
                matches: matches || [],
                source: data.content.source,
                updatedAt: data.content.updatedAt
            });

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania meczów Ekstraklasy:', error);
            setError(error.message || 'Nie udało się pobrać listy meczów');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchesData();
    }, [pageNumber]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
        const dayName = days[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${dayName}, ${day}.${month}, ${hours}:${minutes}`;
    };

    const getMatchStatusClass = (state) => {
        if (!state) return 'match-upcoming';
        if (state.description === 'Finished') return 'match-finished';
        if (state.clock > 0) return 'match-live';
        return 'match-upcoming';
    };

    const getMatchStatusText = (state) => {
        if (!state) return 'Nie rozpoczęty';
        if (state.description === 'Finished') return 'ZAKOŃCZONY';
        if (state.clock > 0) return `${state.clock}'`;
        return 'Nie rozpoczęty';
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie danych meczów...</p>
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
                        <button className="btn" onClick={fetchMatchesData} style={{ marginTop: '20px' }}>
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
                        {matchesData.pageNumber} - Ekstraklasa - sezon 2025
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: SPORTS | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      MECZE EKSTRAKLASY           ║
╚═══════════════════════════════════╝`}
                </div>

                {warning && (
                    <div className="info-section" style={{
                        textAlign: 'center',
                        padding: '20px',
                        border: '2px solid #ffaa00',
                        backgroundColor: '#1a1a00',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '18px', color: '#ffaa00', marginBottom: '10px' }}>
                            ⚠️ Ostrzeżenie
                        </h3>
                        <p style={{ fontSize: '14px', color: '#ffcc66', lineHeight: '1.6' }}>
                            {warning}
                        </p>
                    </div>
                )}

                {matchesData && matchesData.matches && matchesData.matches.length > 0 ? (
                    <div className="info-section">
                        <div style={{
                            textAlign: 'center',
                            padding: '15px',
                            border: '2px solid #00ff00',
                            backgroundColor: '#0a3d0a',
                            marginBottom: '30px'
                        }}>
                            <h3 style={{ fontSize: '20px', color: '#00ff00', marginBottom: '5px' }}>
                                {matchesData.description}
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }}>
                            {matchesData.matches.map((match, index) => {
                                const statusClass = getMatchStatusClass(match.state);
                                const isFinished = match.state?.description === 'Finished';

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '20px',
                                            border: `2px solid ${isFinished ? '#00ff00' : '#00aa00'}`,
                                            backgroundColor: isFinished ? '#0a3d0a' : '#0a0a0a',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: isFinished ? '#00ff00' : '#ffaa00',
                                            color: '#000',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            borderRadius: '3px'
                                        }}>
                                            {getMatchStatusText(match.state)}
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: '#00aa00', marginBottom: '5px' }}>
                                                {match.round}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#00aa00' }}>
                                                📅 {formatDate(match.date)}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 2fr',
                                            alignItems: 'center',
                                            gap: '20px',
                                            marginTop: '15px'
                                        }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ff00' }}>
                                                    {match.homeTeam}
                                                </div>
                                            </div>

                                            <div style={{
                                                textAlign: 'center',
                                                fontSize: '32px',
                                                fontWeight: 'bold',
                                                color: isFinished ? '#ffff00' : '#00ff00'
                                            }}>
                                                {match.state?.currentScore || '-'}
                                            </div>

                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ff00' }}>
                                                    {match.awayTeam}
                                                </div>
                                            </div>
                                        </div>

                                        {match.state?.penaltiesScore && (
                                            <div style={{
                                                marginTop: '10px',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                color: '#ffaa00'
                                            }}>
                                                Karne: {match.state.penaltiesScore}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

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
                                ⚽ Źródło: Highlightly API | Ostatnia aktualizacja: {new Date(matchesData.updatedAt).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="info-section" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#ffaa00', marginBottom: '15px' }}>
                            ⚽ Brak meczów do wyświetlenia
                        </p>
                        <p style={{ fontSize: '14px', color: '#00aa00', marginBottom: '20px' }}>
                            {matchesData?.description || 'Nie znaleziono meczów dla wybranego tygodnia'}
                        </p>
                        {!warning && (
                            <p style={{ fontSize: '12px', color: '#888' }}>
                                Jeśli problem się powtarza, sprawdź konfigurację szablonu lub skontaktuj się z administratorem.
                            </p>
                        )}
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchMatchesData}>
                        🔄 Odśwież dane
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default MatchesPage;