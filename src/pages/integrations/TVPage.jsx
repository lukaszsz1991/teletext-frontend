import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

function TVPage() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [tvData, setTvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTVProgram = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);
                if (!response.ok) throw new Error('Nie można pobrać programu TV');
                const data = await response.json();
                setTvData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTVProgram();
    }, [pageNumber]);

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie programu TV...</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error || !tvData) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error || 'Nie znaleziono programu TV'}</p>
                        <button className="btn" onClick={() => navigate('/pages')} style={{ marginTop: '20px' }}>
                            ← Powrót do listy
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    const { title, description, additionalData } = tvData.content || {};
    const categoryName = tvData.category?.category || 'Program TV';
    const program = additionalData?.program || [];
    const channelName = additionalData?.channelName || 'Nieznany kanał';
    const date = additionalData?.date || '';

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        📺 {title || `Strona ${pageNumber}`}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#00aa00', marginBottom: '5px' }}>
                        Kategoria: {categoryName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#ffaa00' }}>
                        {channelName} | {formatDate(date)}
                    </p>
                </div>

                {description && (
                    <div className="info-section">
                        <p style={{ fontSize: '14px', color: '#00dd00' }}>
                            {description}
                        </p>
                    </div>
                )}

                {program.length > 0 ? (
                    <div className="info-section">
                        <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#ffaa00' }}>
                            Program ({program.length} pozycji):
                        </h3>
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {program.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: '20px',
                                        paddingBottom: '15px',
                                        borderBottom: index < program.length - 1 ? '1px solid #333' : 'none'
                                    }}
                                >
                                    <div style={{ marginBottom: '8px' }}>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#00ff00',
                                            marginRight: '10px'
                                        }}>
                                            🕐 {formatTime(item.time)}
                                        </span>
                                        <span style={{ fontSize: '15px', color: '#00dd00' }}>
                                            {item.title}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p style={{
                                            fontSize: '13px',
                                            lineHeight: '1.6',
                                            color: '#00aa00',
                                            marginLeft: '45px'
                                        }}>
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p style={{ color: '#888' }}>Brak programu dla wybranego dnia</p>
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

export default TVPage;