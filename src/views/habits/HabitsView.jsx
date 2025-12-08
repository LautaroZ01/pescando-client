// src/views/habits/HabitsView.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    getHabits,
    createHabit,
    toggleTask,
    deleteTask,
    updateHabit,
    deleteHabit,
} from '../../API/HabitAPI';

export default function HabitsView() {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null); // null = creando, objeto = editando
    const [newHabit, setNewHabit] = useState({
        nombre: '',
        categoria: '',
        tareas: [''],
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadHabits();
    }, []);

    // abrir modal si vengo del Dashboard con state { openModal: true }
    useEffect(() => {
        if (location.state?.openModal) {
            setShowModal(true);
        }
    }, [location.state]);

    const loadHabits = async () => {
        try {
            setLoading(true);
            const habitsData = await getHabits();
            // ahora la API ya devuelve [{ _id, nombre, categoria, tareas: [...] }]
            setHabits(habitsData || []);
        } catch (error) {
            console.error('Error al cargar hábitos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTarea = async (habitId, tareaId) => {
        try {
            const updatedHabit = await toggleTask(habitId, tareaId);

            setHabits((prev) =>
                prev.map((h) => (h._id === habitId ? updatedHabit : h))
            );
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            alert('Error al actualizar la tarea');
        }
    };


    const handleDeleteTarea = async (habitId, tareaId) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            const updatedHabit = await deleteTask(habitId, tareaId);

            // Si el back devuelve null (se borró el hábito porque no quedaban tareas)
            if (!updatedHabit) {
                setHabits((prev) => prev.filter((h) => h._id !== habitId));
            } else {
                setHabits((prev) =>
                    prev.map((h) => (h._id === habitId ? updatedHabit : h))
                );
            }
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            alert('Error al eliminar la tarea');
        }
    };

    // manejo de inputs de tareas múltiples en el modal
    const handleTaskChange = (index, value) => {
        const updated = [...newHabit.tareas];
        updated[index] = value;
        setNewHabit({ ...newHabit, tareas: updated });
    };

    const handleAddTaskField = () => {
        setNewHabit({ ...newHabit, tareas: [...newHabit.tareas, ''] });
    };

    const handleRemoveTaskField = (index) => {
        const updated = [...newHabit.tareas];
        updated.splice(index, 1);
        if (updated.length === 0) updated.push('');
        setNewHabit({ ...newHabit, tareas: updated });
    };

    const resetForm = () => {
        setNewHabit({
            nombre: '',
            categoria: '',
            tareas: [''],
        });
        setEditingHabit(null);
    };

    const handleOpenEditHabit = (habit) => {
        setEditingHabit(habit);
        setNewHabit({
            nombre: habit.nombre,
            categoria: habit.categoria,
            tareas: habit.tareas.map((t) => t.titulo),
        });
        setShowModal(true);
    };

    const handleDeleteHabit = async (habitId) => {
        if (!confirm('¿Estás seguro de eliminar este hábito completo?')) return;

        try {
            await deleteHabit(habitId);
            setHabits((prev) => prev.filter((h) => h._id !== habitId));
        } catch (error) {
            console.error('Error al eliminar hábito:', error);
            alert('Error al eliminar el hábito');
        }
    };

    const handleAgregarHabito = async (e) => {
        e.preventDefault();

        const tareasLimpias = newHabit.tareas
            .map((t) => t.trim())
            .filter(Boolean);

        if (
            !newHabit.nombre.trim() ||
            !newHabit.categoria.trim() ||
            tareasLimpias.length === 0
        ) {
            alert('Completá nombre, categoría y al menos una tarea');
            return;
        }

        try {
            setSubmitting(true);

            if (editingHabit) {
                // 
                await updateHabit(editingHabit._id, {
                    nombre: newHabit.nombre,
                    categoria: newHabit.categoria,
                    tareas: tareasLimpias,
                });
            } else {
                // CREAR
                await createHabit({
                    nombre: newHabit.nombre,
                    categoria: newHabit.categoria,
                    tareas: tareasLimpias,
                });
            }

            await loadHabits();
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar hábito:', error);
            alert('Error al guardar el hábito');
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <div className="text-2xl font-bold text-orange-500">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
            <div className="ml-20 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Hábitos</h1>
                        <p className="text-gray-600">
                            Gestiona y da seguimiento a todos tus hábitos
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Agregar Hábito
                    </button>
                </div>

                {habits.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center">
                        <span className="text-6xl mb-4 block">🎣</span>
                        <p className="text-2xl font-bold text-gray-800 mb-2">
                            ¡Comienza a pescar hábitos!
                        </p>
                        <p className="text-gray-600 mb-6">
                            Crea tu primer hábito para comenzar tu viaje de crecimiento
                        </p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105"
                        >
                            Crear mi primer hábito
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {habits.map((habit) => {
                            const completadas = habit.tareas.filter(
                                (t) => t.completado
                            ).length;
                            const total = habit.tareas.length || 1;
                            const progreso = Math.round((completadas / total) * 100);

                            return (
                                <div
                                    key={habit._id}
                                    className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {habit.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {habit.categoria}
                                            </p>
                                        </div>
                                        <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                            {completadas}/{habit.tareas.length}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-300 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                                            style={{ width: `${progreso}%` }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        {habit.tareas.map((tarea) => (
                                            <div
                                                key={tarea._id}
                                                className="group flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/70 transition"
                                            >
                                                <div
                                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                                    onClick={() =>
                                                        handleToggleTarea(
                                                            habit._id,
                                                            tarea._id
                                                        )
                                                    }
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${tarea.completado
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        {tarea.completado && (
                                                            <span className="text-white text-sm">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-gray-800 truncate ${tarea.completado
                                                                ? 'line-through opacity-60'
                                                                : ''
                                                                }`}
                                                        >
                                                            {tarea.titulo}
                                                        </p>
                                                        {tarea.diasConsecutivos > 0 && (
                                                            <p className="text-xs text-orange-500 font-semibold">
                                                                🔥 {tarea.diasConsecutivos} días
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteTarea(
                                                            habit._id,
                                                            tarea._id
                                                        )
                                                    }
                                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-2"
                                                    title="Eliminar tarea"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* BOTONES DE EDITAR / ELIMINAR HÁBITO */}
                                    <div className="mt-4 flex justify-end gap-3">
                                        <button
                                            onClick={() => handleOpenEditHabit(habit)}
                                            className="px-4 py-2 rounded-full text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                                        >
                                            Editar hábito
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteHabit(habit._id)
                                            }
                                            className="px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        >
                                            Eliminar hábito
                                        </button>
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
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingHabit ? 'Editar hábito' : 'Nuevo hábito'}
                        </h2>

                        <form onSubmit={handleAgregarHabito}>
                            {/* Nombre del hábito */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nombre del hábito
                                </label>
                                <input
                                    type="text"
                                    value={newHabit.nombre}
                                    onChange={(e) =>
                                        setNewHabit({
                                            ...newHabit,
                                            nombre: e.target.value,
                                        })
                                    }
                                    placeholder="Ej: Programación Web"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Categoría */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={newHabit.categoria}
                                    onChange={(e) =>
                                        setNewHabit({
                                            ...newHabit,
                                            categoria: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                    disabled={submitting}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Informática">Informática</option>
                                    <option value="Productividad">Productividad</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            {/* Tareas múltiples */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tareas
                                </label>
                                <div className="space-y-3">
                                    {newHabit.tareas.map((tarea, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={tarea}
                                                onChange={(e) =>
                                                    handleTaskChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={
                                                    index === 0
                                                        ? 'Ej: Practicar React'
                                                        : 'Otra tarea...'
                                                }
                                                className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                                disabled={submitting}
                                            />
                                            {newHabit.tareas.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTaskField(index)
                                                    }
                                                    className="px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 text-sm"
                                                    disabled={submitting}
                                                    title="Eliminar campo"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddTaskField}
                                    className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                    disabled={submitting}
                                >
                                    + Agregar otra tarea
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm(); // esto ya pone editingHabit en null
                                    }}
                                    className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                                    disabled={submitting}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium shadow-md hover:from-orange-500 hover:to-red-500 transition"
                                >
                                    {submitting
                                        ? 'Guardando...'
                                        : editingHabit
                                            ? 'Guardar cambios'
                                            : 'Crear hábito'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
