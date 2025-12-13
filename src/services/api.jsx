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

export const clearSession = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
};

const PAGES_STORAGE_KEY = 'teletext_mock_pages';

const getStoredPages = () => {
    const stored = localStorage.getItem(PAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveStoredPages = (pages) => {
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
};

const getDefaultMockPages = () => {
    return [
        {
            id: 1,
            pageNumber: 100,
            title: 'Strona główna wiadomości',
            category: { originalName: 'NEWS', category: 'Wiadomości' },
            createdAt: '2025-12-10T10:00:00',
            updatedAt: '2025-12-13T15:30:00'
        },
        {
            id: 2,
            pageNumber: 101,
            title: 'Najnowsze wydarzenia',
            category: { originalName: 'NEWS', category: 'Wiadomości' },
            createdAt: '2025-12-11T12:00:00',
            updatedAt: '2025-12-13T16:00:00'
        },
        {
            id: 3,
            pageNumber: 200,
            title: 'Sport - wyniki meczów',
            category: { originalName: 'SPORTS', category: 'Sport' },
            createdAt: '2025-12-12T09:00:00',
            updatedAt: '2025-12-13T18:00:00'
        },
        {
            id: 4,
            pageNumber: 201,
            title: 'Ekstraklasa - tabela',
            category: { originalName: 'SPORTS', category: 'Sport' },
            createdAt: '2025-12-12T14:00:00',
            updatedAt: '2025-12-13T19:00:00'
        },
        {
            id: 5,
            pageNumber: 500,
            title: 'Prognoza pogody',
            category: { originalName: 'WEATHER', category: 'Pogoda' },
            createdAt: '2025-12-13T08:00:00',
            updatedAt: '2025-12-13T20:00:00'
        }
    ];
};

export const getNextAvailablePageNumber = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedPages = getStoredPages();
            const defaultPages = getDefaultMockPages();
            const allPages = [...defaultPages, ...storedPages];

            const usedNumbers = allPages.map(p => p.pageNumber);

            for (let num = 100; num <= 999; num++) {
                if (!usedNumbers.includes(num)) {
                    resolve({ nextNumber: num });
                    return;
                }
            }

            resolve({ nextNumber: 999 });
        }, 500);
    });
};

export const createPage = async (pageData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pageData.pageNumber === 999) {
                reject({
                    response: {
                        status: 400,
                        data: { message: 'Numer strony 999 jest zarezerwowany' }
                    }
                });
                return;
            }

            const storedPages = getStoredPages();
            const categories = [
                { originalName: 'NEWS', category: 'Wiadomości' },
                { originalName: 'SPORTS', category: 'Sport' },
                { originalName: 'LOTTERY', category: 'Gry losowe' },
                { originalName: 'TV', category: 'Program TV' },
                { originalName: 'WEATHER', category: 'Pogoda' },
                { originalName: 'JOBS', category: 'Oferty pracy' },
                { originalName: 'HOROSCOPE', category: 'Horoskop' },
                { originalName: 'FINANCE', category: 'Finanse' },
                { originalName: 'MISC', category: 'Różne' }
            ];

            const categoryData = categories.find(c => c.originalName === pageData.category);

            const newPage = {
                id: Date.now(),
                pageNumber: pageData.pageNumber,
                title: pageData.title,
                category: categoryData || { originalName: pageData.category, category: pageData.category },
                content: pageData.content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            storedPages.push(newPage);
            saveStoredPages(storedPages);

            resolve(newPage);
        }, 1000);
    });
};

export const getCategories = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { originalName: 'NEWS', category: 'Wiadomości' },
                { originalName: 'SPORTS', category: 'Sport' },
                { originalName: 'LOTTERY', category: 'Gry losowe' },
                { originalName: 'TV', category: 'Program TV' },
                { originalName: 'WEATHER', category: 'Pogoda' },
                { originalName: 'JOBS', category: 'Oferty pracy' },
                { originalName: 'HOROSCOPE', category: 'Horoskop' },
                { originalName: 'FINANCE', category: 'Finanse' },
                { originalName: 'MISC', category: 'Różne' }
            ]);
        }, 300);
    });
};

export const getAllPages = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedPages = getStoredPages();
            const defaultPages = getDefaultMockPages();
            const allPages = [...defaultPages, ...storedPages];
            resolve(allPages);
        }, 500);
    });
};

export const deletePage = async (pageId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const storedPages = getStoredPages();
            const defaultPages = getDefaultMockPages();

            const isDefaultPage = defaultPages.some(p => p.id === pageId);
            if (isDefaultPage) {
                reject({
                    response: {
                        status: 403,
                        data: { message: 'Nie można usunąć domyślnej strony demo' }
                    }
                });
                return;
            }

            const filteredPages = storedPages.filter(p => p.id !== pageId);
            saveStoredPages(filteredPages);
            resolve({ success: true });
        }, 500);
    });
};

export default apiClient;