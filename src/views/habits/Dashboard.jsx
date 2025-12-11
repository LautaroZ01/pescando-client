import { useState, useEffect } from 'react';
import { getStats, getHabits } from '../../API/HabitAPI';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import GenerateRoutine from '../../components/habit/GenerateRoutine';

export default function Dashboard() {
    const { data } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalHabits: 0,
        completedHabits: 0,
        maxStreak: 0,
        progressToday: 0
    });
    const [recentHabits, setRecentHabits] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, habitsData] = await Promise.all([
                getStats(),
                getHabits()
            ]);

            setStats(statsData || {
                totalHabits: 0,
                completedHabits: 0,
                maxStreak: 0,
                progressToday: 0
            });
            setRecentHabits((habitsData || []).slice(0, 5));
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
            setError('No se pudieron cargar los datos. Inténtalo de nuevo en unos minutos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 flex items-center justify-center">
                <div className="text-2xl font-bold text-orange-500">Cargando...</div>
            </div>
        );
    }

    const safeProgress = Math.max(0, Math.min(100, stats.progressToday || 0));

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200 p-6">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🎣</span>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Pescando
                            </h1>
                        </div>
                        <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-full shadow-md flex items-center gap-2">
                            <span className="text-xl">🔥</span>
                            <span className="font-bold">{stats.maxStreak || 0} días</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-orange-500">¡Qué bueno verte, </span>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {data?.firstname || 'Usuario'}!
                        </span>
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-700 font-medium mb-2">Progreso del día</p>
                        <p className="text-4xl font-bold text-gray-800 mb-3">{safeProgress}%</p>
                        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${safeProgress}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
                            <p className="text-gray-600 text-sm mb-1">Racha actual</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.maxStreak || 0} días</p>
                        </div>
                        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
                            <p className="text-gray-600 text-sm mb-1">Completados hoy</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.completedHabits || 0}</p>
                        </div>
                        <div className="bg-white/80 rounded-2xl p-6 shadow-md">
                            <p className="text-gray-600 text-sm mb-1">Total de hábitos</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalHabits || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-400/20 to-pink-400/20 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-orange-200">
                    <p className="text-xl text-gray-700 italic text-center">
                        "Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito."
                    </p>
                    <p className="text-right text-gray-600 mt-2">- Aristóteles</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Hábitos de hoy</h2>

                        <div className="flex gap-3">
                            <Link
                                to="/dashboard/habits"
                                state={{ openModal: true }}
                                className="bg-gradient-to-r from-orange-300 to-red-300 hover:from-orange-400 hover:to-red-400 text-white px-6 py-2 rounded-full shadow-md font-medium text-sm transition-all hover:scale-105"
                            >
                                Agregar
                            </Link>

                            <Link
                                to="/dashboard/habits"
                                className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-2 rounded-full shadow-md font-medium text-sm transition-all hover:scale-105"
                            >
                                Ver todos
                            </Link>
                        </div>
                    </div>

                    {recentHabits.length === 0 ? (
                        <div className="bg-white/70 rounded-3xl shadow-inner py-10 px-6 text-center">
                            <span className="text-6xl mb-4 block">🎣</span>
                            <p className="text-xl font-bold text-gray-800 mb-2">
                                ¡Comienza a pescar hábitos!
                            </p>
                            <p className="text-gray-600 mb-4">
                                Crea tu primer hábito para comenzar tu viaje de crecimiento.
                            </p>
                            <Link
                                to="/habits"
                                state={{ openModal: true }}
                                className="inline-block bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105"
                            >
                                Crear hábito
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white/80 rounded-3xl shadow-inner p-6">
                            <ul className="space-y-4">
                                {recentHabits.map((habit) => (
                                    <li
                                        key={habit._id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {habit.nombre}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {habit.categoria.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Racha</p>
                                            <p className="text-sm md:text-base font-bold text-orange-500">
                                                {habit.diasConsecutivos || 0} días
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <GenerateRoutine />

        </div>
    );
}