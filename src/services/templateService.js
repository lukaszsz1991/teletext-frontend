import apiClient from './api';

export const getTemplates = async (category = null, includeInactive = false) => {
    try {
        const params = {};
        if (category) params.category = category;
        if (includeInactive) params.includeInactive = includeInactive;

        const response = await apiClient.get('/admin/templates', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTemplateById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/templates/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTemplate = async (data) => {
    try {
        const response = await apiClient.post('/admin/templates', {
            name: data.name,
            source: data.source,
            category: data.category,
            configJson: data.configJson
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTemplate = async (id, data) => {
    try {
        const response = await apiClient.put(`/admin/templates/${id}`, {
            name: data.name,
            source: data.source,
            category: data.category,
            configJson: data.configJson
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTemplate = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/templates/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activateTemplate = async (id) => {
    try {
        const response = await apiClient.patch(`/admin/templates/${id}/activate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};