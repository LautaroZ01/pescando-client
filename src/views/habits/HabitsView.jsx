import { useState, useEffect } from 'react';
import { getHabits, createHabit, toggleTask, deleteTask, deleteHabit, updateHabit } from '../../API/HabitAPI';
import { getCategoriesByUser } from '../../API/CategoryAPI';
import GenerateRoutine from '../../components/habit/GenerateRoutine';
import ConfirmationModal from '../../components/ConfirmationModal';


export default function HabitsView() {
    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [newHabit, setNewHabit] = useState({
        nombre: '',
        categoria: '',
        tareas: ['']
    });
    const [submitting, setSubmitting] = useState(false);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: 'danger',
        title: '',
        message: '',
        onConfirm: () => { }
    });
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadHabits();
    }, [filter]);

    const loadCategories = async () => {
        try {
            const categoriesData = await getCategoriesByUser();
            setCategories(categoriesData || []);
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    };

    const loadHabits = async () => {
        try {
            setLoading(true);
            const statusToSend = filter === 'all' ? '' : filter;

            const habitsData = await getHabits(statusToSend);
            setHabits(habitsData || []);
        } catch (error) {
            console.error('Error cargando hábitos:', error);
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };

    const refreshHabits = async () => {
        try {
            const habitsData = await getHabits();
            setHabits(habitsData || []);
        } catch (error) {
            console.error("Error refrescando hábitos:", error);
        }
    }

    const handleToggleTarea = async (habitId, taskId) => {
        try {
            const updatedHabit = await toggleTask(habitId, taskId);

            setHabits(habits.map(habit =>
                habit._id === habitId ? updatedHabit : habit
            ));
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    };

    const openDeleteModal = (habitId, taskId, tareaTitulo) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: '¿Eliminar tarea?',
            message: `¿Estás seguro de que deseas eliminar "${tareaTitulo}"? Esta acción no se puede deshacer.`,
            onConfirm: () => handleDeleteTask(habitId, taskId)
        });
    };

    const handleDeleteTask = async (habitId, taskId) => {
        try {
            const updatedHabit = await deleteTask(habitId, taskId);

            if (updatedHabit) {
                setHabits(habits.map(habit =>
                    habit._id === habitId ? updatedHabit : habit
                ));
            } else {
                setHabits(habits.filter(h => h._id !== habitId));
            }
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    const openDeleteHabitModal = (habitId, habitNombre) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: '¿Eliminar hábito completo?',
            message: `¿Estás seguro de que deseas eliminar el hábito "${habitNombre}" con todas sus tareas? Esta acción no se puede deshacer.`,
            onConfirm: () => handleDeleteHabit(habitId)
        });
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            await deleteHabit(habitId);
            setHabits(habits.filter(h => h._id !== habitId));
        } catch (error) {
            console.error('Error al eliminar hábito:', error);
        }
    };

    const openEditModal = (habit) => {
        setEditingHabit(habit._id);
        setNewHabit({
            nombre: habit.nombre,
            categoria: habit.categoria?._id,
            tareas: habit.tareas.map(t => t.titulo)
        });
        setShowModal(true);
    };

    const handleSubmitHabit = async () => {
        const tareasLimpias = newHabit.tareas.filter(t => t.trim() !== '');

        if (!newHabit.nombre || !newHabit.categoria || tareasLimpias.length === 0) {
            return;
        }

        try {
            setSubmitting(true);

            const habitData = {
                nombre: newHabit.nombre,
                categoria: newHabit.categoria,
                tareas: tareasLimpias
            }

            if (editingHabit) {
                await updateHabit(editingHabit, habitData);
            } else {
                await createHabit(habitData);
            }

            await refreshHabits();
            closeModal();
        } catch (error) {
            console.error('Error al guardar hábito:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingHabit(null);
        setNewHabit({ nombre: '', categoria: '', tareas: [''] });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: 'danger',
            title: '',
            message: '',
            onConfirm: () => { }
        });
    };

    const addTareaField = () => {
        setNewHabit({ ...newHabit, tareas: [...newHabit.tareas, ''] });
    };

    const removeTareaField = (index) => {
        setNewHabit({
            ...newHabit,
            tareas: newHabit.tareas.filter((_, i) => i !== index)
        });
    };

    const updateTareaField = (index, value) => {
        const newTareas = [...newHabit.tareas];
        newTareas[index] = value;
        setNewHabit({ ...newHabit, tareas: newTareas });
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <div className="text-2xl font-bold text-orange-500">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200">
            <div className="ml-20 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Hábitos</h1>
                        <p className="text-gray-600">Gestiona y da seguimiento a todos tus hábitos</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Agregar Hábito
                    </button>
                </div>

                <div className='flex gap-2 mb-6'>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${filter === 'all'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-white/50 text-gray-600 hover:bg-white'
                            }`}>
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${filter === 'pending'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-white/50 text-gray-600 hover:bg-white'
                            }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${filter === 'completed'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-white/50 text-gray-600 hover:bg-white'
                            }`}
                    >
                        Completados
                    </button>
                </div>

                {habits.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center">
                        <span className="text-6xl mb-4 block">{filter === 'completed' ? '📝' : '🎣'}</span>
                        <p className="text-2xl font-bold text-gray-800 mb-2">
                            ¡{filter === 'completed'
                                ? 'No tienes hábitos completados hoy!'
                                : filter === 'pending'
                                    ? 'Estás al día! No hay pendientes'
                                    : '¡Comienza a pescar hábitos!'}
                        </p>
                        <p className="text-gray-600 mb-6">
                            Crea tu primer hábito para comenzar tu viaje de crecimiento
                        </p>
                        {filter === 'all' && (<button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105"
                        >
                            Crear mi primer hábito
                        </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {habits.map(habit => {
                            const completadas = habit.tareas.filter(t => t.completado).length;
                            const total = habit.tareas.length;
                            const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

                            // AHORA accedemos al objeto habit.categoria directamente
                            // Se usa optional chaining (?.) por si la categoría fue borrada
                            const catColor = habit.categoria?.color || '#ccc';
                            const catIcon = habit.categoria?.icon || '❓';
                            const catName = habit.categoria?.name || 'Sin categoría';

                            return (
                                <div key={habit._id} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 flex items-center gap-3">
                                            {/* Icono de Categoría */}
                                            <div
                                                className="size-10 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0"
                                                style={{ backgroundColor: catColor }}
                                            >
                                                {catIcon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-800 truncate" title={catName}>
                                                    {catName}
                                                </h3>
                                                <p className="text-sm text-gray-600 truncate">{habit.nombre}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => openEditModal(habit)}
                                                className="text-blue-500 hover:text-blue-700 transition p-2 cursor-pointer"
                                                title="Editar hábito"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => openDeleteHabitModal(habit._id, habit.categoria.name)}
                                                className="text-red-500 hover:text-red-700 transition p-2 cursor-pointer"
                                                title="Eliminar hábito completo"
                                            >
                                                🗑️
                                            </button>
                                            <div className="flex flex-col items-center ml-4">
                                                <span className="text-lg font-bold text-orange-500">
                                                    {habit.diasConsecutivos || 0} 🔥
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-300 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                                            style={{ width: `${progreso}%` }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        {habit.tareas.map(tarea => (
                                            <div
                                                key={tarea._id}
                                                className="group flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/70 transition"
                                            >
                                                <div
                                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                                    onClick={() => handleToggleTarea(habit._id, tarea._id)}
                                                >
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${tarea.completado ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}>
                                                        {tarea.completado && <span className="text-white text-sm">✓</span>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-gray-800 ${tarea.completado ? 'line-through opacity-60' : ''}`}>
                                                            {tarea.titulo}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => openDeleteModal(habit._id, tarea._id, tarea.titulo)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition p-2"
                                                    title="Eliminar tarea"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            {editingHabit ? 'Editar hábito' : 'Nuevo hábito'}
                        </h2>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nombre del hábito
                                </label>
                                <input
                                    type="text"
                                    value={newHabit.nombre}
                                    onChange={(e) => setNewHabit({ ...newHabit, nombre: e.target.value })}
                                    placeholder="Ej: Programar diariamente"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Selector de Categoría */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Categoría
                                </label>
                                {categories.length === 0 ? (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
                                        No tienes categorías creadas. Crea una primero en la sección de Categorías.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-white/50 rounded-xl border-2 border-gray-200">
                                        {categories.map((category) => (
                                            <button
                                                key={category._id}
                                                type="button"
                                                onClick={() => setNewHabit({ ...newHabit, categoria: category._id })}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${newHabit.categoria === category._id
                                                    ? 'bg-orange-100 ring-2 ring-orange-400 shadow-md'
                                                    : 'bg-white hover:bg-orange-50'
                                                    }`}
                                                disabled={submitting}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm flex-shrink-0"
                                                    style={{ backgroundColor: category.color }}
                                                >
                                                    {category.icon}
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="font-semibold text-gray-800">{category.name}</p>
                                                    {category.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
                                                    )}
                                                </div>
                                                {newHabit.categoria === category._id && (
                                                    <span className="text-orange-500 text-xl">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tareas
                                </label>
                                {newHabit.tareas.map((tarea, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tarea}
                                            onChange={(e) => updateTareaField(index, e.target.value)}
                                            placeholder={`Tarea ${index + 1}`}
                                            className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                            disabled={submitting}
                                        />
                                        {newHabit.tareas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTareaField(index)}
                                                className="px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                                                disabled={submitting}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTareaField}
                                    className="w-full px-4 py-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition font-medium"
                                    disabled={submitting}
                                >
                                    + Agregar tarea
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                                    disabled={submitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitHabit}
                                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submitting || !newHabit.categoria}
                                >
                                    {submitting ? 'Guardando...' : (editingHabit ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
            <GenerateRoutine />
        </div>
    );
}