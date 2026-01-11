import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_.REACT_APP_API_URL || 'http://localhost:8080/api';

function WeatherPage() {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/502`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setCityName(data.content.title);

            const mappedData = data.content.additionalData.dailyWeathers.map(day => ({
                date: day.date,
                maxTemp: day.maxTemperature,
                minTemp: day.minTemperature
            }));

            setWeatherData(mappedData);
            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania danych pogody:', error);
            setError('Nie udało się pobrać danych pogody');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName} ${day}.${month}`;
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie danych pogodowych...</p>
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
                        <button className="btn" onClick={fetchWeather} style={{ marginTop: '20px' }}>
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
                        502 - Prognoza Pogody
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: WEATHER | {cityName} | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔══════════════════════════════════╗
║   PROGNOZA 7-DNIOWA - ${cityName.toUpperCase()}   ║
╚══════════════════════════════════╝`}
                </div>

                <div className="info-section">
                    <div style={{
                        display: 'grid',
                        gap: '15px',
                        fontSize: '14px'
                    }}>
                        {weatherData.map((day, index) => (
                            <div
                                key={day.date}
                                style={{
                                    padding: '15px',
                                    border: '1px solid #00aa00',
                                    backgroundColor: index === 0 ? '#0a3d0a' : '#0a0a0a',
                                    display: 'grid',
                                    gridTemplateColumns: '200px 1fr 1fr',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}
                            >
                                <div>
                                    <strong style={{ color: index === 0 ? '#00ff00' : '#00ff00' }}>
                                        {formatDate(day.date)}
                                    </strong>
                                    {index === 0 && (
                                        <span style={{
                                            marginLeft: '10px',
                                            fontSize: '12px',
                                            color: '#ffff00'
                                        }}>
                                            [DZIŚ]
                                        </span>
                                    )}
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '24px', color: '#ff6b6b' }}>
                                        🌡️ MAX: {day.maxTemp}°C
                                    </span>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '24px', color: '#4dabf7' }}>
                                        ❄️ MIN: {day.minTemp}°C
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
                        <p style={{ fontSize: '12px', color: '#00aa00' }}>
                            🌐 Źródło: OpenMeteo API | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                        </p>
                    </div>
                </div>

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchWeather}>
                        🔄 Odśwież dane
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default WeatherPage;