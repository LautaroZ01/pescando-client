import { useState, useEffect } from 'react';
import { habitAPI } from '../../API/HabitAPI';

export default function HabitsView() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newHabit, setNewHabit] = useState({
        nombre: '',
        categoria: 'Estudio'
    });

    // READ - Cargar hábitos al montar el componente
    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            const data = await habitAPI.getHabits();
            setHabits(data.habits);
        } catch (error) {
            console.error('Error al cargar hábitos:', error);
        } finally {
            setLoading(false);
        }
    };

    // CREATE - Crear nuevo hábito
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await habitAPI.createHabit(newHabit);
            setShowModal(false);
            setNewHabit({ nombre: '', categoria: 'Estudio' });
            loadHabits(); // Recargar lista
        } catch (error) {
            console.error('Error al crear hábito:', error);
        }
    };

    // DELETE - Eliminar hábito
    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este hábito?')) {
            try {
                await habitAPI.deleteHabit(id);
                loadHabits(); // Recargar lista
            } catch (error) {
                console.error('Error al eliminar hábito:', error);
            }
        }
    };

    // UPDATE - Marcar como completado
    const handleComplete = async (id) => {
        try {
            await habitAPI.markComplete(id);
            loadHabits(); // Recargar lista
        } catch (error) {
            console.error('Error al marcar hábito:', error);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mis hábitos</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg"
                >
                    + Nuevo hábito
                </button>
            </div>

            {/* Lista de hábitos */}
            <div className="grid gap-4">
                {habits.map(habit => (
                    <div key={habit._id} className="bg-purple-100 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{habit.nombre}</h3>
                            <span className="text-sm">{habit.categoria}</span>
                            <p className="text-sm">🔥 {habit.diasConsecutivos} días consecutivos</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleComplete(habit._id)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                ✓ Completar
                            </button>
                            <button
                                onClick={() => handleDelete(habit._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear hábito */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Nuevo hábito</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block mb-2">Nombre del hábito</label>
                                <input
                                    type="text"
                                    value={newHabit.nombre}
                                    onChange={(e) => setNewHabit({...newHabit, nombre: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Categoría</label>
                                <select
                                    value={newHabit.categoria}
                                    onChange={(e) => setNewHabit({...newHabit, categoria: e.target.value})}
                                    className="w-full p-2 border rounded"
                                >
                                    <option>Estudio</option>
                                    <option>Programación</option>
                                    <option>Salud</option>
                                    <option>Lectura</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-300 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}