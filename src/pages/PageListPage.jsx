import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPages } from '../services/api';
import Scanlines from '../components/layout/Scanlines';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/teletext.css';

function PageListPage() {
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        setError(null);

        try {
            const allPages = await getAllPages();

            const integrationPages = [
                { id: 'int-502', pageNumber: 502, title: 'Prognoza Pogody (LIVE)', category: { category: 'Pogoda' } },
                { id: 'int-801', pageNumber: 801, title: 'Kursy Walut (LIVE)', category: { category: 'Finanse' } },
                { id: 'int-102', pageNumber: 102, title: 'Najnowsze Wiadomości (LIVE)', category: { category: 'Wiadomości' } },
                { id: 'int-302', pageNumber: 302, title: 'Wyniki Lotto (LIVE)', category: { category: 'Gry losowe' } }
            ];

            const combinedPages = [...allPages, ...integrationPages];
            const sortedPages = combinedPages.sort((a, b) => a.pageNumber - b.pageNumber);
            setPages(sortedPages);
        } catch (err) {
            setError('Nie udało się pobrać listy stron.');
        } finally {
            setLoading(false);
        }
    };
    const handlePageClick = (pageNumber) => {
        navigate(`/pages/${pageNumber}`);
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie listy stron...</p>
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
                        <button className="btn" onClick={fetchPages} style={{ marginTop: '20px' }}>
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
                    <h2>📺 Lista Stron Telegazety</h2>
                    <p>Kliknij na stronę aby ją wyświetlić</p>
                </div>

                <div className="page-list">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="page-card"
                            onClick={() => handlePageClick(page.pageNumber)}
                        >
                            <div className="page-number">{page.pageNumber}</div>
                            <div className="page-title">{page.title}</div>
                            <div className="page-category">
                                {typeof page.category === 'object' ? page.category.category : page.category}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="info-section" style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '12px', textAlign: 'center' }}>
                        Łącznie stron: <strong>{pages.length}</strong>
                    </p>
                </div>

                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/')}>
                        ← Strona główna
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default PageListPage;