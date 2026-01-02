import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.jsx';
import '../styles/teletext.css';

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Walidacja formularza
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Login jest wymagany';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Hasło jest wymagane';
        } else if (formData.password.length < 5) {
            newErrors.password = 'Hasło musi mieć minimum 5 znaków';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Obsługa zmiany wartości w inputach
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Czyść błąd dla tego pola podczas wpisywania
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Czyść błąd API
        if (apiError) {
            setApiError('');
        }
    };

    // Obsługa submitu formularza
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            // Wywołanie API logowania przez serwis - ZMIENIONE: username zamiast email
            const response = await login(formData.username, formData.password);

            // Zapisz token w localStorage
            if (response.token) {
                localStorage.setItem('jwt_token', response.token);
                localStorage.setItem('user_email', formData.username);  // ZMIENIONE

                // Przekierowanie do panelu admina
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Błąd logowania:', error);

            if (error.response) {
                // Błąd zwrócony przez serwer
                if (error.response.status === 401) {
                    setApiError('Nieprawidłowy login lub hasło');
                } else if (error.response.status === 403) {
                    setApiError('Brak uprawnień administratora');
                } else {
                    setApiError('Błąd serwera. Spróbuj ponownie później');
                }
            } else if (error.request) {
                // Brak odpowiedzi z serwera
                setApiError('Brak połączenia z serwerem');
            } else {
                setApiError('Wystąpił nieoczekiwany błąd');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Efekt scanlines */}
            <div className="scanlines"></div>

            {/* Header */}
            <div className="header">
                <h1>TELEGAZETA</h1>
                <p>PANEL ADMINISTRACYJNY</p>
            </div>

            {/* Formularz logowania */}
            <div className="info-section" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h3>Logowanie Administratora</h3>

                {/* ASCII Art */}
                <div className="ascii-art" style={{ textAlign: 'center', margin: '20px 0' }}>
                    {`┌─────────────────────┐
│   DOSTĘP CHRONIONY  │
│      [ADMIN]        │
└─────────────────────┘`}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Pole Username - ZMIENIONE */}
                    <div style={{ marginBottom: '20px' }}>
                        <label
                            htmlFor="username"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            ► Login:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0a0a0a',
                                border: errors.username ? '2px solid #ff0000' : '2px solid #00ff00',
                                color: '#00ff00',
                                fontFamily: 'Courier New, monospace',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                            placeholder="admin"
                        />
                        {errors.username && (
                            <div style={{
                                color: '#ff0000',
                                fontSize: '12px',
                                marginTop: '5px',
                                padding: '5px',
                                border: '1px solid #ff0000',
                                backgroundColor: '#1a0000'
                            }}>
                                ✗ {errors.username}
                            </div>
                        )}
                    </div>

                    {/* Pole Hasło */}
                    <div style={{ marginBottom: '20px' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            ► Hasło:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0a0a0a',
                                border: errors.password ? '2px solid #ff0000' : '2px solid #00ff00',
                                color: '#00ff00',
                                fontFamily: 'Courier New, monospace',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <div style={{
                                color: '#ff0000',
                                fontSize: '12px',
                                marginTop: '5px',
                                padding: '5px',
                                border: '1px solid #ff0000',
                                backgroundColor: '#1a0000'
                            }}>
                                ✗ {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Błąd API */}
                    {apiError && (
                        <div className="error" style={{ marginBottom: '20px', padding: '15px' }}>
                            <strong>✗ BŁĄD:</strong> {apiError}
                        </div>
                    )}

                    {/* Przycisk Zaloguj */}
                    <button
                        type="submit"
                        className="btn"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '16px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        {isLoading ? '⟳ LOGOWANIE...' : '▶ ZALOGUJ SIĘ'}
                    </button>
                </form>

                {/* Przycisk powrotu do strony głównej */}
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => window.location.href = '/'}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#0a0a0a',
                            borderColor: '#00aa00'
                        }}
                    >
                        ← POWRÓT DO STRONY GŁÓWNEJ
                    </button>
                </div>

                {/* Informacja testowa (usunąć w produkcji) */}
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    border: '1px solid #00aa00',
                    backgroundColor: '#0a0a0a',
                    fontSize: '11px',
                    color: '#00aa00'
                }}>
                    <strong>ℹ INFORMACJA DEWELOPERSKA:</strong><br />
                    Endpoint: POST /api/admin/auth/login<br />
                    Oczekiwany format odpowiedzi: {`{ "token": "jwt_token_here" }`}
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <p>TELEGAZETA © 2025 | SYSTEM ZARZĄDZANIA</p>
                <p>DOSTĘP TYLKO DLA AUTORYZOWANYCH ADMINISTRATORÓW</p>
            </div>
        </div>
    );
}

export default AdminLogin;