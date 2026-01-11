import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_.REACT_APP_API_URL || 'http://localhost:8080/api';

function MatchesPage() {
    const navigate = useNavigate();
    const [matchesData, setMatchesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMatchesData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/202`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setMatchesData({
                pageNumber: data.pageNumber,
                title: data.content.title,
                description: data.content.description,
                matches: data.content.additionalData.matches,
                source: data.content.source,
                updatedAt: data.content.updatedAt
            });

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania meczów Ekstraklasy:', error);
            setError('Nie udało się pobrać listy meczów');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchesData();
        // Odświeżaj co 2 minuty (mecze mogą być live)
        const interval = setInterval(fetchMatchesData, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMatchStatusColor = (state) => {
        if (!state) return '#00aa00';
        if (state.description === 'Finished') return '#00aa00';
        if (state.description === 'Live' || state.clock > 0) return '#ffff00';
        return '#00aaaa'; // Scheduled
    };

    const getMatchStatusText = (state) => {
        if (!state) return 'Zaplanowany';
        if (state.description === 'Finished') return 'Zakończony';
        if (state.clock && state.clock > 0) return `${state.clock}'`;
        return state.description || 'Zaplanowany';
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie meczów...</p>
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
                        {matchesData.pageNumber} - {matchesData.title}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: SPORTS | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║       MECZE EKSTRAKLASY           ║
╚═══════════════════════════════════╝`}
                </div>

                {matchesData && (
                    <div className="info-section">
                        <div className="sports-info">
                            <p>{matchesData.description}</p>
                        </div>

                        <div className="matches-list">
                            {matchesData.matches.map((match, index) => (
                                <div key={index} className="match-card">
                                    <div className="match-header">
                                        <span className="match-round">{match.round}</span>
                                        <span className="match-date">{formatDate(match.date)}</span>
                                    </div>

                                    <div className="match-teams">
                                        <div className="team home-team">
                                            <span className="team-name">{match.homeTeam}</span>
                                        </div>

                                        <div className="match-score">
                                            {match.state && match.state.currentScore ? (
                                                <span className="score">{match.state.currentScore}</span>
                                            ) : (
                                                <span className="vs">VS</span>
                                            )}
                                        </div>

                                        <div className="team away-team">
                                            <span className="team-name">{match.awayTeam}</span>
                                        </div>
                                    </div>

                                    <div className="match-footer">
                                        <span
                                            className="match-status"
                                            style={{ color: getMatchStatusColor(match.state) }}
                                        >
                                            {getMatchStatusText(match.state)}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
                                ⚽ Źródło: {matchesData.source} | Ostatnia aktualizacja: {new Date(matchesData.updatedAt).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchMatchesData}>
                        🔄 Odśwież wyniki
                    </button>
                    <button className="btn" onClick={() => navigate('/pages/201')}>
                        📊 Tabela ligowa
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default MatchesPage;