import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor dodający token JWT do każdego requestu
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor obsługujący wygaśnięcie tokena
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_email');

            if (window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    // MOCK
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'admin@test.pl' && password === 'admin123') {
                resolve({ token: 'mock_jwt_token_12345' });
            } else {
                reject({ response: { status: 401 } });
            }
        }, 1000);
    });

    // Odkomentować na produkcji
    // try {
    //     const response = await apiClient.post('/auth/login', { email, password });
    //     return response.data;
    // } catch (error) {
    //     throw error;
    // }
};

// Funkcja wylogowania
export const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Sprawdzenie czy token jest ważny
export const verifyToken = async () => {
    try {
        const response = await apiClient.get('/auth/verify');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Sprawdza czy użytkownik jest zalogowany
export const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    return !!token;
};

// Pobiera aktualny token
export const getToken = () => {
    return localStorage.getItem('jwt_token');
};

// Czyści dane sesji
export const clearSession = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
};

export default apiClient;