import api from '../libs/axios';

// Obtener todos los hábitos de la comunidad (con filtros opcionales)
export async function getCommunityHabits(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/community${queryString ? `?${queryString}` : ''}`;
    const { data } = await api.get(url);
    return data;
}

// Obtener hábitos por categoría específica
export async function getHabitsByCategory(categoria) {
    const { data } = await api.get(`/community/category/${categoria}`);
    return data;
}

// Publicar un nuevo hábito en la comunidad
export async function publishHabit(habitData) {
    const { data } = await api.post('/community', habitData);
    return data;
}

// Compartir un hábito existente desde "Mis Hábitos"
export async function shareMyHabit(habitId) {
    const { data } = await api.post(`/community/share/${habitId}`);
    return data;
}

// Copiar un hábito de la comunidad a "Mis Hábitos"
export async function copyHabitToMyHabits(habitId) {
    const { data } = await api.post(`/community/${habitId}/copy`);
    return data;
}

// Reaccionar a un hábito (corazón o like)
export async function toggleReaction(habitId, type) {
    const { data } = await api.patch(`/community/${habitId}/react`, { type });
    return data;
}

// Valorar un hábito (1-5 estrellas)
export async function rateHabit(habitId, stars) {
    const { data } = await api.patch(`/community/${habitId}/rate`, { stars });
    return data;
}

// Obtener mis hábitos publicados
export async function getMyPublishedHabits() {
    const { data } = await api.get('/community/my-habits');
    return data;
}

// Eliminar un hábito publicado
export async function deleteHabit(habitId) {
    const { data } = await api.delete(`/community/${habitId}`);
    return data;
}

// Obtener un hábito específico por ID
export async function getHabitById(habitId) {
    const { data } = await api.get(`/community/${habitId}`);
    return data;
}