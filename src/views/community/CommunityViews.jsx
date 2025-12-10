import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCommunityHabits, toggleReaction, rateHabit, copyHabitToMyHabits, shareMyHabit } from '../../API/CommunityAPI';
import { getHabits } from '../../API/HabitAPI';
import { useAuth } from '../../hooks/useAuth';
import { getCategories } from '../../API/CategoryAPI';
import { useQuery } from '@tanstack/react-query';

export default function CommunityView() {
    const navigate = useNavigate();
    const { data: userData, isError } = useAuth();
    const isAuthenticated = !isError && userData;

    const [habits, setHabits] = useState([]);
    const [myHabits, setMyHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchHabits();
    }, [selectedCategory, sortBy]);

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });


    const fetchHabits = async () => {
        setLoading(true);
        try {
            const params = { sortBy };
            if (selectedCategory !== 'Todos') {
                params.categoria = selectedCategory;
            }
            const data = await getCommunityHabits(params);
            setHabits(data.habits || []);
        } catch (error) {
            console.error('Error al cargar hábitos:', error);
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMyPersonalHabits = async () => {
        try {
            const data = await getHabits();
            setMyHabits(data || []);
        } catch (error) {
            console.error('Error al cargar mis hábitos:', error);
            setMyHabits([]);
        }
    };

    // Función para mostrar modal de autenticación
    const requireAuth = (message) => {
        setAuthMessage(message);
        setShowAuthModal(true);
    };

    const handleShareExisting = async (habitId) => {
        try {
            await shareMyHabit(habitId);
            alert('¡Hábito compartido exitosamente en la comunidad!');
            setShowShareModal(false);
            fetchHabits();
        } catch (error) {
            console.error('Error al compartir:', error);
            alert(error.response?.data?.error || 'Error al compartir el hábito');
        }
    };

    const handleReaction = async (habitId, type) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para reaccionar a los hábitos');
            return;
        }

        try {
            await toggleReaction(habitId, type);
            fetchHabits();
        } catch (error) {
            console.error('Error al reaccionar:', error);
        }
    };

    const handleRate = async (habitId, stars) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para valorar hábitos');
            return;
        }

        try {
            await rateHabit(habitId, stars);
            fetchHabits();
        } catch (error) {
            console.error('Error al valorar:', error);
        }
    };

    const handleCopy = async (habitId) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para copiar hábitos a tu cuenta');
            return;
        }

        try {
            await copyHabitToMyHabits(habitId);
            alert('¡Hábito copiado a tus hábitos personales!');
        } catch (error) {
            console.error('Error al copiar:', error);
            alert(error.response?.data?.error || 'Error al copiar el hábito');
        }
    };

    const handleGoToMyHabits = () => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para gestionar tus hábitos personales');
            return;
        }
        navigate('/dashboard/habits');
    };

    const handleShareButtonClick = () => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para compartir tus hábitos con la comunidad');
            return;
        }
        loadMyPersonalHabits();
        setShowShareModal(true);
    };

    const StarRating = ({ habitId, currentRating, userRating }) => {
        const [hoveredStar, setHoveredStar] = useState(0);

        return (
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => handleRate(habitId, star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="text-xl hover:scale-125 transition-transform"
                        >
                            {(hoveredStar ? star <= hoveredStar : star <= (userRating || currentRating))
                                ? '⭐'
                                : '☆'}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-600">
                    {currentRating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-sm shadow-lg p-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🎣</span>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            Comunidad Pescando
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros y Acciones */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    {/* Categorías */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categoriesLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">Cargando categorías...</span>
                                <span className="animate-spin"></span>
                            </div>
                        ) : (
                            categoriesData.map((cat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === cat.name
                                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Ordenamiento y Acciones */}
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        {/* Ordenar por */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'recent'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🕒 Recientes
                            </button>
                            <button
                                onClick={() => setSortBy('rating')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'rating'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                ⭐ Mejor valorados
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'popular'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🔥 Populares
                            </button>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleGoToMyHabits}
                                        className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                    >
                                        📝 Mis Hábitos
                                    </button>
                                    <button
                                        onClick={handleShareButtonClick}
                                        className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                    >
                                        ➕ Compartir mis hábitos
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => requireAuth('Debes iniciar sesión para interactuar con los hábitos')}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                >
                                    🔐 Inicia sesión para interactuar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid de Hábitos */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl font-bold text-orange-500">Cargando...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {habits.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <p className="text-2xl text-gray-500">
                                    🌐 No hay hábitos compartidos aún
                                </p>
                            </div>
                        ) : (
                            habits.map(habit => (
                                <div
                                    key={habit._id}
                                    className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
                                >
                                    {/* Header con categoría */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-400 text-white">
                                            {habit.categoria.name}
                                        </span>
                                        {habit.copiedCount > 0 && (
                                            <span className="text-xs text-gray-500">
                                                📋 {habit.copiedCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nombre del hábito */}
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {habit.nombre}
                                    </h3>

                                    {/* Descripción */}
                                    {habit.descripcion && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {habit.descripcion}
                                        </p>
                                    )}

                                    {/* Rating */}
                                    <div className="mb-3">
                                        <StarRating
                                            habitId={habit._id}
                                            currentRating={habit.averageRating}
                                            userRating={habit.userRating}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {habit.totalRatings} valoraciones
                                        </span>
                                    </div>

                                    {/* Reacciones */}
                                    <div className="flex gap-4 mb-4">
                                        <button
                                            onClick={() => handleReaction(habit._id, 'heart')}
                                            className="flex items-center gap-1 hover:scale-110 transition-transform"
                                        >
                                            <span className="text-xl">
                                                {habit.userHasHearted ? '❤️' : '🤍'}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {habit.reactionsCount?.hearts || 0}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleReaction(habit._id, 'like')}
                                            className="flex items-center gap-1 hover:scale-110 transition-transform"
                                        >
                                            <span className="text-xl">
                                                {habit.userHasLiked ? '👍' : '👍🏻'}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {habit.reactionsCount?.likes || 0}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Footer con autor y botón copiar */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {habit.userName?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-700 font-medium">
                                                {habit.userName || 'Anónimo'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(habit._id)}
                                            className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition-all hover:scale-105"
                                        >
                                            📋 Copiar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal de autenticación requerida */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Inicio de sesión necesario
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {authMessage}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => navigate('/auth/login')}
                                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para compartir hábito existente */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Compartir mis hábitos
                        </h2>

                        {myHabits.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">
                                    No tienes hábitos creados aún
                                </p>
                                <button
                                    type="button"
                                    onClick={handleGoToMyHabits}
                                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium"
                                >
                                    Crear mi primer hábito
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myHabits.map(habit => (
                                    <div
                                        key={habit._id}
                                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {habit.nombre}
                                                </h3>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-400 text-white">
                                                        {habit.categoria.name}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        📝 {habit.tareas?.length || 0} tareas
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleShareExisting(habit._id)}
                                                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                            >
                                                📤 Compartir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="w-full px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}