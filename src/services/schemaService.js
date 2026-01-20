import apiClient from './api';

export const getSchemas = async () => {
    try {
        const response = await apiClient.get('/admin/schemas');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSchemaBySource = async (source) => {
    try {
        const response = await apiClient.get(`/admin/schemas/${source}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};