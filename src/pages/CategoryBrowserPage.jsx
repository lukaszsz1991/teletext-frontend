import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../components/layout/Scanlines';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/teletext.css';

const API_BASE_URL = window.env?.REACT_APP_API_URL || 'http://localhost:8080/api';

const CategoryBrowserPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [allPages, setAllPages] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPages, setFilteredPages] = useState({});
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await fetch(`${API_BASE_URL}/public/categories`);
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                const pagesData = {};
                for (const category of categoriesData) {
                    const pagesResponse = await fetch(
                        `${API_BASE_URL}/public/pages?category=${category.originalName}`
                    );
                    const pages = await pagesResponse.json();
                    pagesData[category.originalName] = pages;
                }

                setAllPages(pagesData);
                setFilteredPages(pagesData);
                setLoading(false);
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;

        const normalizedText = normalizeText(text);
        const normalizedQuery = normalizeText(query);
        const index = normalizedText.indexOf(normalizedQuery);

        if (index === -1) return text;

        const start = index;
        const end = index + query.length;

        return (
            <>
                {text.substring(0, start)}
                <span style={{ backgroundColor: '#ffaa00', color: '#000' }}>
                    {text.substring(start, end)}
                </span>
                {text.substring(end)}
            </>
        );
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredPages(allPages);
            setNoResults(false);
            return;
        }

        const normalizedQuery = normalizeText(searchQuery);
        const filtered = {};
        let hasResults = false;

        categories.forEach((category) => {
            const categoryName = category.originalName;
            const categoryDisplayName = normalizeText(category.category);
            const pages = allPages[categoryName] || [];

            const matchingPages = pages.filter((page) => {
                const titleMatch = normalizeText(page.title || '').includes(normalizedQuery);
                const categoryMatch = categoryDisplayName.includes(normalizedQuery);
                return titleMatch || categoryMatch;
            });

            if (matchingPages.length > 0) {
                filtered[categoryName] = matchingPages;
                hasResults = true;
            }
        });

        setFilteredPages(filtered);
        setNoResults(!hasResults);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setFilteredPages(allPages);
        setNoResults(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (loading) {
        return (
            <>
                <Scanlines />
                <div className="container">
                    <Header />
                    <div className="info-section" style={{ textAlign: 'center' }}>
                        <p>Ładowanie kategorii...</p>
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

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    padding: '20px',
                    border: '2px solid #00aa00',
                    backgroundColor: '#0a0a0a'
                }}>
                    <h2 style={{ fontSize: '24px', color: '#00ff00', margin: 0 }}>
                        Przeglądaj strony
                    </h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Wyszukaj..."
                            style={{
                                padding: '10px 15px',
                                fontSize: '14px',
                                backgroundColor: '#0a0a0a',
                                color: '#00ff00',
                                border: '2px solid #00aa00',
                                outline: 'none',
                                fontFamily: 'monospace',
                                minWidth: '250px'
                            }}
                        />
                        <button
                            className="btn"
                            onClick={handleSearch}
                            style={{ padding: '10px 20px' }}
                        >
                            🔍 SZUKAJ
                        </button>
                        {searchQuery && (
                            <button
                                className="btn"
                                onClick={handleClearSearch}
                                style={{ padding: '10px 20px', borderColor: '#ffaa00', color: '#ffaa00' }}
                            >
                                ✖ WYCZYŚĆ
                            </button>
                        )}
                    </div>
                </div>

                {noResults && (
                    <div className="info-section" style={{
                        textAlign: 'center',
                        padding: '30px',
                        border: '2px solid #ffaa00',
                        backgroundColor: '#1a1a00',
                        marginBottom: '30px'
                    }}>
                        <p style={{ fontSize: '18px', color: '#ffaa00', marginBottom: '15px' }}>
                            🔍 Brak wyników dla: "{searchQuery}"
                        </p>
                        <button className="btn" onClick={handleClearSearch}>
                            WYCZYŚĆ WYSZUKIWANIE
                        </button>
                    </div>
                )}

                {categories.map((category) => {
                    const pages = filteredPages[category.originalName] || [];

                    if (pages.length === 0) {
                        return null;
                    }

                    return (
                        <div key={category.originalName} style={{ marginBottom: '40px' }}>
                            <div style={{
                                padding: '15px 20px',
                                backgroundColor: '#003300',
                                border: '2px solid #00aa00',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{ fontSize: '20px', color: '#00ff00', margin: 0 }}>
                                    {category.category}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#00aa00', margin: '5px 0 0 0' }}>
                                    {category.description} • {pages.length} {pages.length === 1 ? 'stron' : 'stron'}
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                gap: '20px'
                            }}>
                                {pages.map((page) => (
                                    <div
                                        key={page.id}
                                        onClick={() => navigate(`/pages/${page.pageNumber}`)}
                                        style={{
                                            padding: '20px',
                                            border: '2px solid #00aa00',
                                            backgroundColor: '#0a0a0a',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#003300';
                                            e.currentTarget.style.borderColor = '#00ff00';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0a0a0a';
                                            e.currentTarget.style.borderColor = '#00aa00';
                                        }}
                                    >
                                        <h4 style={{ fontSize: '18px', color: '#00ff00', marginBottom: '10px' }}>
                                            {highlightMatch(page.title, searchQuery)}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '12px', color: '#00aa00' }}>
                                                {category.originalName}
                                            </span>
                                            <span style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                color: '#00ff00'
                                            }}>
                                                {page.pageNumber}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div className="button-group" style={{ marginTop: '40px' }}>
                    <button className="btn" onClick={() => navigate('/')}>
                        ← Powrót do strony głównej
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default CategoryBrowserPage;