import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Scanlines from '../components/layout/Scanlines';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/teletext.css';

const API_BASE_URL = window._env_.REACT_APP_API_URL || 'http://localhost:8080/api';

function ManualPageWrapper() {
    const navigate = useNavigate();
    const { pageNumber } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/pages/${pageNumber}`);
                if (!response.ok) throw new Error('Nie znaleziono strony');
                const data = await response.json();
                setPageData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [pageNumber]);

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie strony {pageNumber}...</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error || !pageData) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error || 'Nie znaleziono strony'}</p>
                        <button className="btn" onClick={() => navigate('/pages')} style={{ marginTop: '20px' }}>
                            ← Powrót do listy
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    // Wydobądź dane które FAKTYCZNIE ISTNIEJĄ
    const title = pageData.content?.title || `Strona ${pageNumber}`;
    const description = pageData.content?.description || '';
    const categoryName = pageData.category?.category || 'MISC';

    return (
        <>
            <Scanlines />
            <div className="container">
                <Header />

                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        {pageNumber} - {title}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: {categoryName}
                    </p>
                </div>

                {description && (
                    <div className="info-section">
                        <div style={{
                            fontSize: '16px',
                            color: '#00dd00',
                            lineHeight: '1.8',
                            padding: '20px',
                            border: '2px solid #00aa00',
                            backgroundColor: '#0a0a0a'
                        }}>
                            {description}
                        </div>
                    </div>
                )}

                <div className="info-section" style={{
                    textAlign: 'center',
                    padding: '30px',
                    border: '1px dashed #555',
                    color: '#888'
                }}>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        💡 To jest strona manualna (MANUAL)
                    </p>
                    <p style={{ fontSize: '12px' }}>
                        Pełna treść będzie dostępna po rozbudowie backendu
                    </p>
                </div>

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

export default ManualPageWrapper;