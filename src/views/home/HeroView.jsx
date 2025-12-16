import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../API/AuthAPI';
import Loader from '../../components/ui/Loader';

export default function HabitsView() {
    // Estado para el usuario
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [habits, setHabits] = useState([
        {
            id: 1,
            categoria: 'Web Developer',
            tareas: [
                { id: 1, texto: 'Practicar flex box', completado: true },
                { id: 2, texto: 'Practicar get/post', completado: true },
                { id: 3, texto: 'Revisar código', completado: false },
                { id: 4, texto: 'Documentar', completado: false },
                { id: 5, texto: 'Practicar maquetado', completado: false }
            ]
        },
        {
            id: 2,
            categoria: 'Estudiar inglés',
            tareas: [
                { id: 6, texto: 'Ver video en inglés', completado: false },
                { id: 7, texto: 'Practicar pronunciación', completado: false }
            ]
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ categoria: '', tarea: '' });

    const diasConsecutivos = 15;
    const habitosCompletados = habits.reduce((acc, h) =>
        acc + h.tareas.filter(t => t.completado).length, 0
    );
    const totalTareas = habits.reduce((acc, h) => acc + h.tareas.length, 0);
    const progresoDia = Math.round((habitosCompletados / totalTareas) * 100);

    // Obtener usuario al cargar el componente
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch (error) {
                console.error('Error al obtener usuario:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const toggleTarea = (habitId, tareaId) => {
        setHabits(habits.map(habit => {
            if (habit.id === habitId) {
                return {
                    ...habit,
                    tareas: habit.tareas.map(tarea =>
                        tarea.id === tareaId
                            ? { ...tarea, completado: !tarea.completado }
                            : tarea
                    )
                };
            }
            return habit;
        }));
    };

    const agregarHabito = (e) => {
        e.preventDefault();
        if (!newHabit.categoria || !newHabit.tarea) return;

        const habitoExistente = habits.find(h => h.categoria === newHabit.categoria);

        if (habitoExistente) {
            setHabits(habits.map(h =>
                h.id === habitoExistente.id
                    ? {
                        ...h,
                        tareas: [...h.tareas, {
                            id: Date.now(),
                            texto: newHabit.tarea,
                            completado: false
                        }]
                    }
                    : h
            ));
        } else {
            setHabits([...habits, {
                id: Date.now(),
                categoria: newHabit.categoria,
                tareas: [{ id: Date.now(), texto: newHabit.tarea, completado: false }]
            }]);
        }

        setNewHabit({ categoria: '', tarea: '' });
        setShowModal(false);
    };

    // Mostrar loading mientras se carga el usuario
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-pink-50 to-rose-50">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-20 bg-linear-to-b from-orange-200 via-rose-200 to-red-200 shadow-lg flex flex-col items-center py-8 gap-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">❤️</span>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">🏆</span>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">📊</span>
                </div>
                <div className="mt-auto w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">👤</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-20 p-8">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🎣</span>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Pescando
                            </h1>
                        </div>
                        <div className="bg-linear-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-full shadow-md flex items-center gap-2">
                            <span className="text-xl">🔥</span>
                            <span className="font-bold">{diasConsecutivos} días</span>
                        </div>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-orange-500">¡Bienvenido, </span>
                        <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {user?.nombre || user?.username || user?.email?.split('@')[0] || 'Usuario'}!
                        </span>
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-700 font-medium mb-2">Progreso del día</p>
                        <p className="text-4xl font-bold text-gray-800 mb-3">{progresoDia}%</p>
                        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-linear-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${progresoDia}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
                            <p className="text-gray-600 text-sm mb-1">Racha actual</p>
                            <p className="text-3xl font-bold text-gray-800">{diasConsecutivos} días consecutivos</p>
                        </div>
                        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
                            <p className="text-gray-600 text-sm mb-1">Esta semana</p>
                            <p className="text-3xl font-bold text-gray-800">{habitosCompletados} hábitos completados</p>
                        </div>
                    </div>
                </div>

                {/* Hábitos de hoy */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Hábitos de hoy</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-linear-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105"
                    >
                        Agregar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {habits.map(habit => {
                        const completadas = habit.tareas.filter(t => t.completado).length;
                        const progreso = Math.round((completadas / habit.tareas.length) * 100);

                        return (
                            <div key={habit.id} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{habit.categoria}</h3>

                                <div className="w-full bg-gray-300 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-linear-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progreso}%` }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    {habit.tareas.map(tarea => (
                                        <div
                                            key={tarea.id}
                                            onClick={() => toggleTarea(habit.id, tarea.id)}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition"
                                        >
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${tarea.completado
                                                ? 'bg-green-500'
                                                : 'bg-red-800'
                                                }`}>
                                                {tarea.completado && <span className="text-white text-sm">✓</span>}
                                            </div>
                                            <span className={`text-gray-800 ${tarea.completado ? 'line-through opacity-60' : ''}`}>
                                                {tarea.texto}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-linear-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuevo hábito</h2>
                        <form onSubmit={agregarHabito}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Categoría del hábito</label>
                                <input
                                    type="text"
                                    value={newHabit.categoria}
                                    onChange={(e) => setNewHabit({ ...newHabit, categoria: e.target.value })}
                                    placeholder="Ej: Web Developer"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Tarea</label>
                                <input
                                    type="text"
                                    value={newHabit.tarea}
                                    onChange={(e) => setNewHabit({ ...newHabit, tarea: e.target.value })}
                                    placeholder="Ej: Practicar flexbox"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-full bg-linear-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
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