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

// AUTHENTICATION

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/admin/auth/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await apiClient.post('/admin/auth/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyToken = async () => {
    try {
        const response = await apiClient.get('/admin/auth/verify');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    return !!token;
};

export const getToken = () => {
    return localStorage.getItem('jwt_token');
};

export const clearSession = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
};

// CATEGORIES

export const getCategories = async () => {
    try {
        const response = await apiClient.get('/public/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// PAGES

export const getAllPages = async (category = 'NEWS', includeInactive = false) => {
    try {
        // Publicznu endpoint
        const response = await apiClient.get('/public/pages', {
            params: { category }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPublicPages = async (category) => {
    try {
        const response = await apiClient.get('/public/pages', {
            params: { category }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPageByNumber = async (pageNumber) => {
    try {
        const response = await apiClient.get(`/public/pages/${pageNumber}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPage = async (pageData) => {
    try {
        const response = await apiClient.post('/admin/pages', {
            pageNumber: pageData.pageNumber,
            title: pageData.title,
            categoryName: pageData.category
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePage = async (pageId, pageData) => {
    try {
        const response = await apiClient.put(`/admin/pages/${pageId}`, {
            pageNumber: pageData.pageNumber,
            title: pageData.title,
            categoryName: pageData.category
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePage = async (pageId) => {
    try {
        const response = await apiClient.delete(`/admin/pages/${pageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// UTILITY - jeżeli backend wspiera

export const getNextAvailablePageNumber = async () => {
    try {
        const allPages = await getAllPages('NEWS', false);
        const usedNumbers = allPages.map(p => p.pageNumber);

        for (let num = 100; num <= 999; num++) {
            if (!usedNumbers.includes(num)) {
                return { nextNumber: num };
            }
        }

        return { nextNumber: 999 };
    } catch (error) {
        throw error;
    }
};

export default apiClient;