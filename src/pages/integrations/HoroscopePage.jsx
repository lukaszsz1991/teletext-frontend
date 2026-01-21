import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function HoroscopePage() {
    const { pageNumber } = useParams();
    const navigate = useNavigate();
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHoroscope = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);
                if (!response.ok) throw new Error('Nie można pobrać horoskopu');
                const data = await response.json();
                setHoroscopeData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHoroscope();
    }, [pageNumber]);

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie horoskopu...</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error || !horoscopeData) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error || 'Nie znaleziono horoskopu'}</p>
                        <button className="btn" onClick={() => navigate('/pages')} style={{ marginTop: '20px' }}>
                            ← Powrót do listy
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    const { title, description, additionalData } = horoscopeData.content || {};
    const categoryName = horoscopeData.category?.category || 'Horoskop';

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#ffaa00' : '#333', fontSize: '20px' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#ffaa00' }}>
                        🔮 {title || `Strona ${pageNumber}`}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: {categoryName}
                    </p>
                </div>

                {description && (
                    <div className="info-section">
                        <div
                            style={{
                                fontSize: '16px',
                                color: '#00dd00',
                                lineHeight: '1.8',
                                padding: '20px',
                                border: '2px solid #00aa00',
                                backgroundColor: '#0a0a0a'
                            }}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}

                {additionalData && (
                    <div className="info-section">
                        <h3 style={{ fontSize: '20px', color: '#ffaa00', marginBottom: '15px' }}>
                            Oceny na dziś:
                        </h3>
                        <div style={{
                            padding: '20px',
                            border: '2px solid #555',
                            backgroundColor: '#0a0a0a'
                        }}>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#ffaa00', fontSize: '14px', marginBottom: '5px' }}>
                                    ❤️ Miłość:
                                </div>
                                <div>{renderStars(additionalData.ratingLove || 0)}</div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#ffaa00', fontSize: '14px', marginBottom: '5px' }}>
                                    💰 Finanse:
                                </div>
                                <div>{renderStars(additionalData.ratingMoney || 0)}</div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#ffaa00', fontSize: '14px', marginBottom: '5px' }}>
                                    😊 Nastrój:
                                </div>
                                <div>{renderStars(additionalData.ratingMood || 0)}</div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#ffaa00', fontSize: '14px', marginBottom: '5px' }}>
                                    💼 Praca:
                                </div>
                                <div>{renderStars(additionalData.ratingWork || 0)}</div>
                            </div>

                            <div>
                                <div style={{ color: '#ffaa00', fontSize: '14px', marginBottom: '5px' }}>
                                    🎉 Przyjemności:
                                </div>
                                <div>{renderStars(additionalData.ratingLeasures || 0)}</div>
                            </div>
                        </div>
                    </div>
                )}

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

export default HoroscopePage;