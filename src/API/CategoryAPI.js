import api from '../libs/axios';

export const getCategories = async () => {
    try {
        const { data } = await api.get('/category');
        return data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
};