import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function LotteryPage() {
    const navigate = useNavigate();
    const [lotteryData, setLotteryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLottery = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/302`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setLotteryData({
                gameType: data.content.additionalData.gameType,
                lastDrawResults: data.content.additionalData.lastDrawResults,
                lastDrawDate: data.content.additionalData.lastDrawDate,
                nextDrawDate: data.content.additionalData.nextDrawDate,
                nextDrawPrize: data.content.additionalData.nextDrawPrize,
                couponPrice: data.content.additionalData.couponPrice,
                draws: data.content.additionalData.draws
            });

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania wyników Lotto:', error);
            setError('Nie udało się pobrać wyników Lotto');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLottery();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrize = (amount) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie wyników Lotto...</p>
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
                        <button className="btn" onClick={fetchLottery} style={{ marginTop: '20px' }}>
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
                        302 - Wyniki Lotto
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: LOTTERY | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔══════════════════════════════════╗
║         WYNIKI LOTTO              ║
╚══════════════════════════════════╝`}
                </div>

                {lotteryData && (
                    <div className="info-section">
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            border: '3px solid #ffff00',
                            backgroundColor: '#0a3d0a',
                            marginBottom: '30px'
                        }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffff00' }}>
                                🎰 OSTATNIE LOSOWANIE
                            </h3>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '15px',
                                marginBottom: '20px'
                            }}>
                                {lotteryData.lastDrawResults.map((number, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            border: '3px solid #ffff00',
                                            backgroundColor: '#003300',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '28px',
                                            fontWeight: 'bold',
                                            color: '#00ff00'
                                        }}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>

                            <div style={{ fontSize: '14px', color: '#00ff00', marginTop: '15px' }}>
                                📅 {formatDate(lotteryData.lastDrawDate)}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                padding: '20px',
                                border: '2px solid #00aa00',
                                backgroundColor: '#0a0a0a'
                            }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#00ff00' }}>
                                    ⏰ NASTĘPNE LOSOWANIE
                                </h3>
                                <p style={{ fontSize: '14px', color: '#00ff00', marginBottom: '10px' }}>
                                    {formatDate(lotteryData.nextDrawDate)}
                                </p>
                                <p style={{ fontSize: '12px', color: '#00aa00' }}>
                                    Losowania: {lotteryData.draws}
                                </p>
                            </div>

                            <div style={{
                                padding: '20px',
                                border: '2px solid #00aa00',
                                backgroundColor: '#0a0a0a'
                            }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#00ff00' }}>
                                    💰 PULA NAGRÓD
                                </h3>
                                <p style={{ fontSize: '24px', color: '#ffff00', fontWeight: 'bold', marginBottom: '10px' }}>
                                    {formatPrize(lotteryData.nextDrawPrize)}
                                </p>
                                <p style={{ fontSize: '12px', color: '#00aa00' }}>
                                    Cena kuponu: {lotteryData.couponPrice}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            border: '2px solid #00aa00',
                            backgroundColor: '#0a0a0a'
                        }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#00ff00' }}>
                                ℹ️ JAK GRAĆ?
                            </h3>
                            <ul style={{ fontSize: '13px', color: '#00aa00', lineHeight: '1.8', paddingLeft: '20px' }}>
                                <li>Wybierz 6 liczb z zakresu 1-49</li>
                                <li>Cena jednego zakładu: {lotteryData.couponPrice}</li>
                                <li>Losowania odbywają się: {lotteryData.draws}</li>
                                <li>Aby wygrać główną nagrodę, trafić trzeba wszystkie 6 liczb</li>
                            </ul>
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
                                🎲 Źródło: Totalizator Sportowy | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchLottery}>
                        🔄 Odśwież wyniki
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default LotteryPage;