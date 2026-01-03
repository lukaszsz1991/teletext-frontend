import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageByNumber } from '../services/api';
import Scanlines from '../components/layout/Scanlines';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/teletext.css';

function PageViewPage() {
    const { pageNumber } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPage();
    }, [pageNumber]);

    const fetchPage = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getPageByNumber(pageNumber);
            setPage(data);
        } catch (err) {
            setError('Nie udało się pobrać strony. Sprawdź numer strony.');
        } finally {
            setLoading(false);
        }
    };

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

    if (error || !page) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center', borderColor: '#ff0000', color: '#ff0000' }}>
                        <h3>Błąd</h3>
                        <p>{error || 'Strona nie została znaleziona'}</p>
                        <button className="btn" onClick={() => navigate('/pages')} style={{ marginTop: '20px' }}>
                            Powrót do listy stron
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

                {/* Numer i tytuł strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        {page.pageNumber} - {page.title}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: {page.category}
                    </p>
                </div>

                {/* Treść strony */}
                <div className="info-section">
                    {page.content && page.content.map((item) => (
                        <p key={item.id} style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                            {item.content}
                        </p>
                    ))}
                </div>

                {/* Przyciski nawigacji */}
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

export default PageViewPage;