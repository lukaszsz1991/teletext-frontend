import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function SportsPage() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [sportsData, setSportsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSportsData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit przekroczony - zbyt wiele zapytań do API. Spróbuj ponownie za kilka minut.');
                }
                if (response.status === 404) {
                    throw new Error(`Strona ${pageNumber} nie istnieje.`);
                }
                if (response.status === 500) {
                    throw new Error('Błąd serwera - nie pobrno danych.');
                }
                throw new Error(`Błąd HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.content || !data.content.additionalData) {
                throw new Error('Nieprawidłowe dane - brak zawartości.');
            }

            const standings = data.content.additionalData.Standings || data.content.additionalData.standings;

            if (!standings) {
                console.warn('Brak danych z zewnętrznego API');
            }

            setSportsData({
                pageNumber: data.pageNumber,
                title: data.content.title,
                description: data.content.description,
                standings: standings || [],
                source: data.content.source,
                updatedAt: data.content.updatedAt
            });

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania tabeli Ekstraklasy:', error);
            setError(error.message || 'Nie udało się pobrać tabeli ligowej');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSportsData();
    }, [pageNumber]);

    const getTeamClass = (position) => {
        if (position <= 2) return 'champions-league';
        if (position >= 3 && position <= 4) return 'europa-league';
        if (position >= 16) return 'relegation';
        return '';
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie tabeli ligowej...</p>
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
                        <button className="btn" onClick={fetchSportsData} style={{ marginTop: '20px' }}>
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
                        {sportsData.pageNumber} - {sportsData.title}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: SPORTS | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      TABELA EKSTRAKLASY           ║
╚═══════════════════════════════════╝`}
                </div>

                {sportsData && sportsData.standings && sportsData.standings.length > 0 ? (
                    <div className="info-section">
                        <div className="sports-info">
                            <p>{sportsData.description}</p>
                        </div>

                        <div className="sports-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Poz</th>
                                    <th>Drużyna</th>
                                    <th>Pkt</th>
                                    <th>M</th>
                                    <th>W</th>
                                    <th>R</th>
                                    <th>P</th>
                                    <th>Bramki</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sportsData.standings.map((team) => (
                                    <tr key={team.position} className={getTeamClass(team.position)}>
                                        <td className="position">{team.position}</td>
                                        <td className="team-name">{team.team}</td>
                                        <td className="points">{team.points}</td>
                                        <td className="games">{team.wins + team.draws + team.loses}</td>
                                        <td className="wins">{team.wins}</td>
                                        <td className="draws">{team.draws}</td>
                                        <td className="loses">{team.loses}</td>
                                        <td className="goals">{team.scoredGoals}:{team.receivedGoals}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="sports-legend">
                            <p>
                                <span className="legend-item champions-league">Liga Mistrzów (1-2)</span>
                                <span className="legend-item europa-league">Liga Konferencji (3-4)</span>
                                <span className="legend-item relegation">Spadek (16-18)</span>
                            </p>
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
                                ⚽ Źródło: {sportsData.source} | Ostatnia aktualizacja: {new Date(sportsData.updatedAt).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="info-section" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#ffaa00', marginBottom: '15px' }}>
                            📊 Brak tabeli do wyświetlenia
                        </p>
                        <p style={{ fontSize: '14px', color: '#00aa00' }}>
                            {sportsData?.description || 'Nie znaleziono tabeli ligowej'}
                        </p>
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchSportsData}>
                        🔄 Odśwież tabelę
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default SportsPage;