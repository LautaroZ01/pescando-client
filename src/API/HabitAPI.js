// src/API/HabitAPI.js
import api from '../libs/axios';

// Obtener todos los hábitos del usuario
export const getHabits = async () => {
    try {
        const { data } = await api.get('/habits');
        // data.habits = [{ _id, nombre, categoria, tareas: [...] }]
        return data.habits;
    } catch (error) {
        console.error('Error al obtener hábitos:', error);
        throw error;
    }
};

// Obtener un hábito específico (si lo usás)
export const getHabitById = async (habitId) => {
    try {
        const { data } = await api.get(`/habits/${habitId}`);
        return data.habit;
    } catch (error) {
        console.error('Error al obtener hábito:', error);
        throw error;
    }
};

// Obtener estadísticas del usuario
export const getStats = async () => {
    try {
        const { data } = await api.get('/habits/stats');
        // { totalHabits, completedHabits, maxStreak, progressToday }
        return data;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
};

// Crear un nuevo hábito con varias tareas
// habitData: { nombre, categoria, tareas: [ 'tarea 1', 'tarea 2', ... ] }
export const createHabit = async (habitData) => {
    try {
        const { data } = await api.post('/habits', habitData);
        // { habit }
        return data.habit;
    } catch (error) {
        console.error('Error al crear hábito:', error);
        throw error;
    }
};

// Actualizar un hábito completo (nombre / categoría)
export const updateHabit = async (habitId, habitData) => {
    try {
        const { data } = await api.put(`/habits/${habitId}`, habitData);
        return data.habit;
    } catch (error) {
        console.error('Error al actualizar hábito:', error);
        throw error;
    }
};

// Toggle de una tarea dentro de un hábito
export const toggleTask = async (habitId, taskId) => {
    try {
        const { data } = await api.patch(`/habits/${habitId}/tasks/${taskId}/toggle`);
        // { habit } actualizado
        return data.habit;
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw error;
    }
};

// Eliminar una tarea dentro de un hábito
export const deleteTask = async (habitId, taskId) => {
    try {
        const { data } = await api.delete(`/habits/${habitId}/tasks/${taskId}`);
        // { habit } o { habit: null } si se queda sin tareas
        return data.habit;
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        throw error;
    }
};

// Eliminar un hábito completo
export const deleteHabit = async (habitId) => {
    try {
        const { data } = await api.delete(`/habits/${habitId}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar hábito:', error);
        throw error;
    }
};
