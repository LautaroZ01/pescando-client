import api from '../libs/axios';

export const habitAPI = {
    // CREATE
    createHabit: async (habitData) => {
        const { data } = await api.post('/habits', habitData);
        return data;
    },

    // READ ALL
    getHabits: async () => {
        const { data } = await api.get('/habits');
        return data;
    },

    // READ ONE
    getHabitById: async (id) => {
        const { data } = await api.get(`/habits/${id}`);
        return data;
    },

    // UPDATE
    updateHabit: async (id, habitData) => {
        const { data } = await api.put(`/habits/${id}`, habitData);
        return data;
    },

    // DELETE
    deleteHabit: async (id) => {
        const { data } = await api.delete(`/habits/${id}`);
        return data;
    },

    // MARK COMPLETE
    markComplete: async (id) => {
        const { data } = await api.patch(`/habits/${id}/complete`);
        return data;
    }
};