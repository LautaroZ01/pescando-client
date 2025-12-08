import api from '../libs/axios';

// Obtener todos los hábitos de la comunidad (PÚBLICO - no requiere autenticación)
export async function getCommunityHabits(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `/community${queryString ? `?${queryString}` : ''}`;
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        // Si no está autenticado, intentar obtener los datos públicamente
        if (error.response?.status === 401) {
            console.warn('Usuario no autenticado, mostrando vista pública');
            return { habits: [] };
        }
        throw error;
    }
}

// Obtener hábitos por categoría específica (PÚBLICO)
export async function getHabitsByCategory(categoria) {
    const { data } = await api.get(`/community/category/${categoria}`);
    return data;
}

// Obtener un hábito específico por ID (PÚBLICO)
export async function getHabitById(habitId) {
    const { data } = await api.get(`/community/${habitId}`);
    return data;
}

// Publicar un nuevo hábito en la comunidad (REQUIERE AUTENTICACIÓN)
export async function publishHabit(habitData) {
    const { data } = await api.post('/community', habitData);
    return data;
}

// Compartir un hábito existente desde "Mis Hábitos" (REQUIERE AUTENTICACIÓN)
export async function shareMyHabit(habitId) {
    const { data } = await api.post(`/community/share/${habitId}`);
    return data;
}

// Copiar un hábito de la comunidad a "Mis Hábitos" (REQUIERE AUTENTICACIÓN)
export async function copyHabitToMyHabits(habitId) {
    const { data } = await api.post(`/community/${habitId}/copy`);
    return data;
}

// Reaccionar a un hábito - corazón o like (REQUIERE AUTENTICACIÓN)
export async function toggleReaction(habitId, type) {
    const { data } = await api.patch(`/community/${habitId}/react`, { type });
    return data;
}

// Valorar un hábito - 1-5 estrellas (REQUIERE AUTENTICACIÓN)
export async function rateHabit(habitId, stars) {
    const { data } = await api.patch(`/community/${habitId}/rate`, { stars });
    return data;
}

// Obtener mis hábitos publicados (REQUIERE AUTENTICACIÓN)
export async function getMyPublishedHabits() {
    const { data } = await api.get('/community/my-habits');
    return data;
}

// Eliminar un hábito publicado (REQUIERE AUTENTICACIÓN - solo el autor)
export async function deleteHabit(habitId) {
    const { data } = await api.delete(`/community/${habitId}`);
    return data;
}