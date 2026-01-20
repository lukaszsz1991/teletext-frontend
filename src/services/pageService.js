import apiClient from './api';

export const getPages = async (includeInactive = false) => {
    try {
        const params = includeInactive ? { includeInactive } : {};
        const response = await apiClient.get('/admin/pages', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPageById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/pages/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPageFromTemplate = async (data) => {
    try {
        const response = await apiClient.post('/admin/pages', {
            type: 'TEMPLATE',
            pageNumber: data.pageNumber,
            category: data.category,
            templateId: data.templateId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createManualPage = async (data) => {
    try {
        const response = await apiClient.post('/admin/pages', {
            type: 'MANUAL',
            pageNumber: data.pageNumber,
            category: data.category,
            title: data.title,
            description: data.description
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePage = async (id, data) => {
    try {
        const response = await apiClient.put(`/admin/pages/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePage = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/pages/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activatePage = async (id) => {
    try {
        const response = await apiClient.patch(`/admin/pages/${id}/activate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};