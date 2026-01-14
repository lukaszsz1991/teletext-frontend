import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { INTEGRATIONS_CONFIG, getCategoryIntegrations } from '../config/integrations-config';

const CategoryBrowserPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const categoriesResponse = await apiClient.get('/public/categories');
            const fetchedCategories = categoriesResponse.data || [];

            const categoriesWithIntegrations = fetchedCategories.map(category => {
                const integrations = getCategoryIntegrations(category.originalName);
                return {
                    ...category,
                    integrations,
                    hasIntegrations: integrations.length > 0
                };
            }).filter(cat => cat.hasIntegrations);

            setCategories(categoriesWithIntegrations);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Nie udało się pobrać kategorii.');
        } finally {
            setLoading(false);
        }
    };

    const navigateToPage = (pageNumber) => {
        navigate(`/pages/${pageNumber}`);
    };

    if (loading) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title">Ładowanie kategorii...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title">Błąd</h1>
                </div>
                <div className="page-content">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

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
                        <div style={{
                            borderBottom: '2px solid #00ff00',
                            marginBottom: '20px',
                            paddingBottom: '10px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                color: '#00ff00',
                                textShadow: '0 0 10px #00ff00'
                            }}>
                                {category.category}
                            </h2>
                            <p style={{ fontSize: '13px', color: '#00aa00', marginTop: '5px' }}>
                                {category.description}
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px'
                        }}>
                            {category.integrations.map((integration) => (
                                <div
                                    key={integration.pageNumber}
                                    onClick={() => navigateToPage(integration.pageNumber)}
                                    style={{
                                        border: '2px solid #00aa00',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        backgroundColor: integration.status === 'active' ? '#0a3d0a' : '#1a1a1a',
                                        cursor: integration.status === 'active' ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        opacity: integration.status === 'active' ? 1 : 0.6
                                    }}
                                    onMouseEnter={(e) => {
                                        if (integration.status === 'active') {
                                            e.currentTarget.style.borderColor = '#00ff00';
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#00aa00';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {integration.status === 'soon' && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: '#ffaa00',
                                            color: '#000',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}>
                                            WKRÓTCE
                                        </div>
                                    )}

                                    {integration.status === 'active' && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: '#00ff00',
                                            color: '#000',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}>
                                            AKTYWNE
                                        </div>
                                    )}

                                    <div style={{
                                        fontSize: '48px',
                                        textAlign: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        {integration.icon}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px'
                                    }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            color: '#00ff00',
                                            margin: 0
                                        }}>
                                            {integration.name}
                                        </h3>
                                    </div>

                                    <p style={{
                                        fontSize: '13px',
                                        color: '#00aa00',
                                        marginBottom: '12px',
                                        minHeight: '40px'
                                    }}>
                                        {integration.description}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #003300'
                                    }}>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#00aa00',
                                            fontFamily: 'monospace'
                                        }}>
                                            KATEGORIA: {integration.category}
                                        </span>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#00ff00',
                                            fontWeight: 'bold'
                                        }}>
                                            {integration.pageNumber}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '40px',
                padding: '20px',
                border: '1px solid #00aa00',
                backgroundColor: '#0a0a0a',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '12px', color: '#00aa00', marginBottom: '5px' }}>
                    📊 Łącznie integracji: {categories.reduce((sum, cat) => sum + cat.integrations.length, 0)}
                </p>
                <p style={{ fontSize: '12px', color: '#00aa00' }}>
                    ✅ Aktywne: {categories.reduce((sum, cat) =>
                    sum + cat.integrations.filter(i => i.status === 'active').length, 0
                )} |
                    ⏳ Wkrótce: {categories.reduce((sum, cat) =>
                    sum + cat.integrations.filter(i => i.status === 'soon').length, 0
                )}
                </p>
            </div>
        </div>
    );
};

export default CategoryBrowserPage;