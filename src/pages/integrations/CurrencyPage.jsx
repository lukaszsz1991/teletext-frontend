import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanlines from '../../components/layout/Scanlines';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/teletext.css';

function CurrencyPage() {
    const navigate = useNavigate();
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        setLoading(true);
        setError(null);

        try {
            const codes = ['EUR', 'USD', 'GBP', 'CHF'];
            const promises = codes.map(code =>
                fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`)
                    .then(r => r.json())
            );

            const results = await Promise.all(promises);
            setCurrencies(results);
        } catch (err) {
            setError('Nie udało się pobrać kursów walut');
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
                        <p>Pobieranie kursów walut...</p>
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
                        <button className="btn" onClick={fetchCurrencies} style={{ marginTop: '20px' }}>
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

                {/* Nagłówek strony */}
                <div className="info-section">
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
                        400 - Kursy Walut
                    </h2>
                    <p style={{ fontSize: '12px', color: '#00aa00' }}>
                        Kategoria: FINANCE | Dane na żywo z NBP API
                    </p>
                </div>

                {/* ASCII Art */}
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>
                    {`╔═══════════════════════════════════╗
║      KURSY WALUT NBP              ║
╚═══════════════════════════════════╝`}
                </div>

                {/* Tabela kursów */}
                <div className="info-section">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #00ff00' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>Waluta</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px' }}>Kod</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '16px' }}>Kurs (PLN)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currencies.map((currency) => (
                            <tr key={currency.code} style={{ borderBottom: '1px solid #003300' }}>
                                <td style={{ padding: '15px', fontSize: '14px' }}>
                                    {currency.currency}
                                </td>
                                <td style={{ padding: '15px', fontSize: '14px', color: '#00ff00', fontWeight: 'bold' }}>
                                    {currency.code}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
                                    {currency.rates[0].mid.toFixed(4)} PLN
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00aa00', backgroundColor: '#0a0a0a' }}>
                        <p style={{ fontSize: '12px', color: '#00aa00' }}>
                            Data kursu: {currencies[0]?.rates[0]?.effectiveDate}
                        </p>
                        <p style={{ fontSize: '12px', color: '#00aa00', marginTop: '5px' }}>
                            Źródło: Narodowy Bank Polski
                        </p>
                    </div>
                </div>

                {/* Przyciski nawigacji */}
                <div className="button-group" style={{ marginTop: '30px' }}>
                    <button className="btn" onClick={() => navigate('/pages')}>
                        ← Powrót do listy
                    </button>
                    <button className="btn" onClick={fetchCurrencies}>
                        🔄 Odśwież kursy
                    </button>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default CurrencyPage;