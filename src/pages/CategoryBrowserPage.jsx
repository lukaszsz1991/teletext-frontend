import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const CategoryBrowserPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategoriesWithPages();
    }, []);

    const fetchCategoriesWithPages = async () => {
        setLoading(true);
        setError(null);

        try {
            // Pobierz kategorie
            const categoriesResponse = await apiClient.get('/public/categories');
            const fetchedCategories = categoriesResponse.data || [];

            console.log('📦 Kategorie:', fetchedCategories.length);

            // Dla każdej kategorii pobierz strony
            const categoriesWithPages = await Promise.all(
                fetchedCategories.map(async (category) => {
                    const pagesResponse = await apiClient.get('/public/pages', {
                        params: { category: category.originalName }
                    });

                    const pages = pagesResponse.data || [];
                    console.log(`📄 ${category.originalName}: ${pages.length} stron`);

                    return { ...category, pages, hasPages: pages.length > 0 };
                })
            );

            // Filtruj kategorie ze stronami
            const withContent = categoriesWithPages.filter(cat => cat.hasPages);

            console.log('✅ Wyświetlam kategorii:', withContent.length);
            setCategories(withContent);
        } catch (err) {
            console.error('❌ Błąd:', err);
            setError('Nie udało się pobrać danych.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="teletext-page"><h1 className="page-title">Ładowanie...</h1></div>;
    if (error) return <div className="teletext-page"><h1 className="page-title">{error}</h1></div>;

    return (
        <div className="teletext-page">
            <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="page-title" style={{ fontSize: '42px', marginBottom: '10px' }}>
                    📺 TELEGAZETA
                </h1>
                <p style={{ fontSize: '14px', color: '#00aa00' }}>
                    Przeglądanie stron telegazety według kategorii
                </p>
            </div>

            <div className="page-content">
                {categories.map((category) => (
                    <div key={category.originalName} style={{ marginBottom: '50px' }}>
                        <div style={{ borderBottom: '2px solid #00ff00', marginBottom: '20px', paddingBottom: '10px' }}>
                            <h2 style={{ fontSize: '24px', color: '#00ff00' }}>
                                {category.category}
                            </h2>
                            <p style={{ fontSize: '13px', color: '#00aa00', marginTop: '5px' }}>
                                {category.description} • {category.pages.length} stron
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {category.pages.map((page) => (
                                <div
                                    key={page.id}
                                    onClick={() => navigate(`/pages/${page.pageNumber}`)}
                                    style={{
                                        border: '2px solid #00aa00',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        backgroundColor: '#0a3d0a',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#00ff00';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#00aa00';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <h3 style={{ fontSize: '18px', color: '#00ff00', margin: '0 0 12px 0' }}>
                                        {page.title}
                                    </h3>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #003300'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#00aa00' }}>
                                            {category.originalName}
                                        </span>
                                        <span style={{ fontSize: '16px', color: '#00ff00', fontWeight: 'bold' }}>
                                            {page.pageNumber}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#00aa00' }}>
                    📊 Łącznie stron: {categories.reduce((sum, cat) => sum + cat.pages.length, 0)} | 📁 Kategorii: {categories.length}
                </p>
            </div>
        </div>
    );
};

export default CategoryBrowserPage;