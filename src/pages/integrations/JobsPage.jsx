import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

const API_BASE_URL = window._env_.REACT_APP_API_URL || 'http://localhost:8080/api';

function JobsPage() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Backend zwraca listę ofert w additionalData.jobs
            const jobsList = data.content.additionalData.jobs || [];
            setJobs(jobsList.slice(0, 10)); // Maksymalnie 10 ofert

            setLoading(false);
        } catch (error) {
            console.error('Błąd podczas pobierania ofert pracy:', error);
            setError('Nie udało się pobrać ofert pracy');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [pageNumber]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Pobieranie ofert pracy...</p>
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
                        <button className="btn" onClick={fetchJobs} style={{ marginTop: '20px' }}>
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
                        {pageNumber} - Oferty Pracy
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: JOBS | Dane z Backend API
                    </p>
                </div>

                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔══════════════════════════════════╗
║      OFERTY PRACY                 ║
╚══════════════════════════════════╝`}
                </div>

                {jobs.length > 0 ? (
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
                                    <a
                                        href={job.link}
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
                                💼 Źródło: Jooble.org | Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Nie znaleziono ofert pracy.</p>
                        <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '10px' }}>
                            Backend może wymagać konfiguracji słów kluczowych.
                        </p>
                    </div>
                )}

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchJobs}>
                        🔄 Odśwież oferty
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default JobsPage;