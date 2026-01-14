import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIntegration } from '../config/integrations-config';

const DynamicPageView = () => {
    const { pageNumber } = useParams();
    const navigate = useNavigate();
    const integration = getIntegration(pageNumber);

    if (!integration) {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title" style={{ color: '#ff0000' }}>
                        ❌ Strona {pageNumber} nie istnieje
                    </h1>
                </div>
                <div className="page-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        border: '2px solid #ff0000',
                        backgroundColor: '#1a0000'
                    }}>
                        <p style={{ fontSize: '16px', color: '#ff6b6b', marginBottom: '20px' }}>
                            Nie znaleziono integracji o numerze {pageNumber}
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/pages')}
                            style={{ marginTop: '20px' }}
                        >
                            ← Powrót do listy integracji
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (integration.status === 'soon') {
        return (
            <div className="teletext-page">
                <div className="page-header">
                    <h1 className="page-title" style={{ color: '#ffaa00' }}>
                        ⏳ {integration.name}
                    </h1>
                </div>
                <div className="page-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        border: '2px solid #ffaa00',
                        backgroundColor: '#1a1a00'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                            {integration.icon}
                        </div>
                        <h2 style={{ fontSize: '24px', color: '#ffaa00', marginBottom: '15px' }}>
                            Integracja wkrótce dostępna
                        </h2>
                        <p style={{ fontSize: '14px', color: '#ffcc66', marginBottom: '10px' }}>
                            {integration.description}
                        </p>
                        <p style={{ fontSize: '12px', color: '#ffaa00', marginTop: '20px' }}>
                            Strona {pageNumber} | Kategoria: {integration.category}
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/pages')}
                            style={{ marginTop: '30px' }}
                        >
                            ← Powrót do listy integracji
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const Component = integration.component;

    return <Component />;
};

export default DynamicPageView;