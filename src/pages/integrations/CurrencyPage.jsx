import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function CurrencyPage() {
    const navigate = useNavigate();
    const [currencyData, setCurrencyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCurrencies = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/801`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const rates = data.content.additionalData.rates;
            const latestRate = rates[rates.length - 1]; // Ostatni kurs (najnowszy)

            setCurrencyData({
                code: data.content.additionalData.code,
                currency: data.content.additionalData.currency,
                latestRate: latestRate,
                rates: rates
            });

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania kursów walut:', error);
            setError('Nie udało się pobrać kursów walut');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie kursów walut...</p>
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
                        <button className="btn" onClick={fetchCurrencies} style={{ marginTop: '20px' }}>
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
                        801 - Kursy Walut
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: FINANCE | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔══════════════════════════════════╗
║      KURSY WALUT NBP              ║
╚══════════════════════════════════╝`}
                </div>

                {currencyData && (
                    <div className="info-section">
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            border: '2px solid #00ff00',
                            backgroundColor: '#0a3d0a',
                            marginBottom: '30px'
                        }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#00ff00' }}>
                                {currencyData.currency.toUpperCase()} / PLN
                            </h3>
                            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff00', marginBottom: '10px' }}>
                                {((currencyData.latestRate.bid + currencyData.latestRate.ask) / 2).toFixed(4)}
                            </div>
                            <div style={{ fontSize: '14px', color: '#00aa00', marginTop: '15px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    💰 Kupno (BID): <strong style={{ color: '#00ff00' }}>{currencyData.latestRate.bid.toFixed(4)} PLN</strong>
                                </div>
                                <div>
                                    💵 Sprzedaż (ASK): <strong style={{ color: '#00ff00' }}>{currencyData.latestRate.ask.toFixed(4)} PLN</strong>
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#00aa00', marginTop: '15px' }}>
                                📅 Data: {currencyData.latestRate.effectiveDate}
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#00ff00' }}>
                                📊 Historia kursów (ostatnie {currencyData.rates.length} dni)
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #00ff00' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px' }}>Data</th>
                                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>Kupno (BID)</th>
                                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>Sprzedaż (ASK)</th>
                                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>Średnia</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currencyData.rates.slice().reverse().map((rate, index) => (
                                    <tr
                                        key={rate.effectiveDate}
                                        style={{
                                            borderBottom: '1px solid #003300',
                                            backgroundColor: index === 0 ? '#0a3d0a' : 'transparent'
                                        }}
                                    >
                                        <td style={{ padding: '12px', fontSize: '13px' }}>
                                            {rate.effectiveDate}
                                            {index === 0 && (
                                                <span style={{ marginLeft: '10px', fontSize: '11px', color: '#ffff00' }}>
                                                        [NAJNOWSZY]
                                                    </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#ff6b6b' }}>
                                            {rate.bid.toFixed(4)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#4dabf7' }}>
                                            {rate.ask.toFixed(4)}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#00ff00' }}>
                                            {((rate.bid + rate.ask) / 2).toFixed(4)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
                                🏦 Źródło: Narodowy Bank Polski | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchCurrencies}>
                        🔄 Odśwież kursy
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default CurrencyPage;