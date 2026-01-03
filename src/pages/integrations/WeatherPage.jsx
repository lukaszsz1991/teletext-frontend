import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

function WeatherPage() {
    const navigate = useNavigate();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            // Warszawa: 52.23°N, 21.01°E
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Warsaw'
            );

            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych pogodowych');
            }

            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherDescription = (code) => {
        const weatherCodes = {
            0: 'Bezchmurnie',
            1: 'Przeważnie bezchmurnie',
            2: 'Częściowo pochmurno',
            3: 'Pochmurno',
            45: 'Mgła',
            48: 'Mgła z szronem',
            51: 'Lekka mżawka',
            53: 'Umiarkowana mżawka',
            55: 'Gęsta mżawka',
            61: 'Słaby deszcz',
            63: 'Umiarkowany deszcz',
            65: 'Silny deszcz',
            71: 'Słaby śnieg',
            73: 'Umiarkowany śnieg',
            75: 'Silny śnieg',
            95: 'Burza',
        };
        return weatherCodes[code] || 'Brak danych';
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

                {/* Nagłówek strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        300 - Prognoza Pogody
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: WEATHER | Dane na żywo z Open Meteo API
                    </p>
                </div>

                {/* ASCII Art */}
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      POGODA DLA WARSZAWY          ║
╚═══════════════════════════════════╝`}
                </div>

                {/* Dane pogodowe */}
                {weather && weather.current && (
                    <div className="info-section">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>🌡️ Temperatura</h3>
                                <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff00', margin: '10px 0' }}>
                                    {weather.current.temperature_2m}°C
                                </p>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>☁️ Warunki</h3>
                                <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                                    {getWeatherDescription(weather.current.weather_code)}
                                </p>
                                <p style={{ fontSize: '14px', color: '#00aa00' }}>
                                    Wilgotność: {weather.current.relative_humidity_2m}%
                                </p>
                                <p style={{ fontSize: '14px', color: '#00aa00' }}>
                                    Wiatr: {weather.current.wind_speed_10m} km/h
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                            <p style={{ fontSize: '12px', color: '#00aa00' }}>
                                Ostatnia aktualizacja: {new Date(weather.current.time).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Przyciski nawigacji */}
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