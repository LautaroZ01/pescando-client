import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunityHabits, toggleReaction, rateHabit, copyHabitToMyHabits, getMyPublishedHabits } from '../../API/CommunityAPI';
import { getHabits, shareMyHabit } from '../../API/HabitAPI';
import { getUser } from '../../API/AuthAPI';

export default function CommunityView() {
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);
    const [myHabits, setMyHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [showMyHabits, setShowMyHabits] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedHabitToShare, setSelectedHabitToShare] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [selectedHabitTasks, setSelectedHabitTasks] = useState([]);
    const [selectedHabitName, setSelectedHabitName] = useState('');
    
    // Nuevos estados para categorías dinámicas
    const [allCategories, setAllCategories] = useState(['Todos']);
    const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(5);

    // Verificar autenticación y obtener usuario
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('AUTH_TOKEN');
            console.log('Token encontrado:', !!token); // Debug
            setIsAuthenticated(!!token);
            
            if (token) {
                try {
                    const userData = await getUser();
                    console.log('Datos del usuario:', userData); // Debug
                    setCurrentUser(userData);
                } catch (error) {
                    console.error('Error al obtener usuario:', error);
                    // Si falla la autenticación, limpiar el estado
                    setIsAuthenticated(false);
                    localStorage.removeItem('AUTH_TOKEN');
                }
            }
        };
        
        checkAuth();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchHabits();
    }, [selectedCategory, showMyHabits, sortBy, isAuthenticated]);

    // Cargar mis hábitos personales cuando se abre el modal
    useEffect(() => {
        if (showModal && isAuthenticated) {
            loadMyPersonalHabits();
        }
    }, [showModal, isAuthenticated]);

    // Función para obtener categorías desde la BD
    const fetchCategories = async () => {
        try {
            const data = await getCommunityHabits({});
            // Extraer categorías únicas de los hábitos
            const uniqueCategories = ['Todos', ...new Set(data.habits?.map(habit => habit.categoria).filter(Boolean))];
            setAllCategories(uniqueCategories);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            // Categorías por defecto en caso de error
            setAllCategories(['Todos', 'Estudio', 'Programación', 'Salud', 'Lectura', 'Otro']);
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

    const fetchHabits = async () => {
        setLoading(true);
        try {
            let data;
            if (showMyHabits && isAuthenticated) {
                data = await getMyPublishedHabits();
            } else {
                const params = { sortBy };
                if (selectedCategory !== 'Todos') {
                    params.categoria = selectedCategory;
                }
                data = await getCommunityHabits(params);
            }
            setHabits(data.habits || []);
        } catch (error) {
            console.error('Error al cargar hábitos:', error);
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para mostrar modal de autenticación
    const requireAuth = (message) => {
        setAuthMessage(message);
        setShowAuthModal(true);
    };

    // Función para mostrar modal de tareas
    const handleShowTasks = (habit) => {
        if (habit.descripcion && habit.descripcion.includes('Tareas:')) {
            const tasks = habit.descripcion
                .replace('Tareas:', '')
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);
            setSelectedHabitTasks(tasks);
            setSelectedHabitName(habit.nombre);
            setShowTasksModal(true);
        }
    };

    const handleShareHabit = async (e) => {
        e.preventDefault();
        
        if (!selectedHabitToShare) {
            alert('Por favor selecciona un hábito para compartir');
            return;
        }

        try {
            await shareMyHabit(selectedHabitToShare);
            setSelectedHabitToShare('');
            setShowModal(false);
            alert('¡Hábito compartido exitosamente en la comunidad!');
            fetchHabits();
            fetchCategories(); // Actualizar categorías después de compartir
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
            requireAuth('Debes registrarte para copiar hábitos a tu cuenta');
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
            requireAuth('Debes registrarte para gestionar tus hábitos personales');
            return;
        }
        navigate('/dashboard/habits');
    };

    const handleShareButtonClick = () => {
        if (!isAuthenticated) {
            requireAuth('Debes registrarte para compartir tus hábitos con la comunidad');
            return;
        }
        setShowModal(true);
    };

    const handleShowMoreCategories = () => {
        setVisibleCategoriesCount(prev => Math.min(prev + 5, allCategories.length));
    };

    const handleShowLessCategories = () => {
        setVisibleCategoriesCount(5);
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

    // Categorías visibles según el estado
    const visibleCategories = allCategories.slice(0, visibleCategoriesCount);
    const hasMoreCategories = allCategories.length > visibleCategoriesCount;
    const canShowLess = visibleCategoriesCount > 5;

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
                    <div className="flex gap-3 items-center">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => navigate('/auth/login')}
                                    className="px-5 py-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 font-medium transition-all border-2 border-gray-200"
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => navigate('/auth/register')}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Información del usuario */}
                                {currentUser && (
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border-2 border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                            {currentUser.photo ? (
                                                <img 
                                                    src={currentUser.photo} 
                                                    alt={currentUser.firstname}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-lg font-bold">
                                                    {currentUser.firstname?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-800">
                                                {currentUser.firstname} {currentUser.lastname}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {currentUser.email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                >
                                    📊 Dashboard
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros y Acciones */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    {/* Categorías */}
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        {visibleCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowMyHabits(false);
                                }}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === cat && !showMyHabits
                                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        
                        {/* Botón Ver más/menos */}
                        {(hasMoreCategories || canShowLess) && (
                            <button
                                onClick={hasMoreCategories ? handleShowMoreCategories : handleShowLessCategories}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-medium text-sm transition-all hover:scale-105"
                            >
                                {hasMoreCategories ? `➕ Ver más (${allCategories.length - visibleCategoriesCount})` : '➖ Ver menos'}
                            </button>
                        )}
                    </div>

                    {/* Ordenamiento y Acciones */}
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        {/* Ordenar por */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    sortBy === 'recent'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🕒 Recientes
                            </button>
                            <button
                                onClick={() => setSortBy('rating')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    sortBy === 'rating'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                ⭐ Mejor valorados
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    sortBy === 'popular'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                🔥 Populares
                            </button>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
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
                                ➕ Compartir hábito
                            </button>
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
                                    {showMyHabits 
                                        ? '📝 Aún no has compartido ningún hábito' 
                                        : '🌐 No hay hábitos compartidos aún'}
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
                                            {habit.categoria}
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

                                    {/* Tareas del hábito */}
                                    {habit.descripcion && habit.descripcion.includes('Tareas:') ? (
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-semibold text-gray-700">Tareas:</p>
                                                <button
                                                    onClick={() => handleShowTasks(habit)}
                                                    className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                                                >
                                                    Ver todas
                                                    <span className="text-sm">📋</span>
                                                </button>
                                            </div>
                                            <ul className="space-y-1">
                                                {habit.descripcion
                                                    .replace('Tareas:', '')
                                                    .split(',')
                                                    .map(tarea => tarea.trim())
                                                    .filter(Boolean)
                                                    .slice(0, 3)
                                                    .map((tarea, index) => (
                                                        <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                                                            <span className="text-orange-500">•</span>
                                                            <span className="line-clamp-1">{tarea}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    ) : habit.descripcion ? (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {habit.descripcion}
                                        </p>
                                    ) : null}

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
                                                {habit.reactionsCount.hearts}
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
                                                {habit.reactionsCount.likes}
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
                                        {!showMyHabits && (
                                            <button
                                                onClick={() => handleCopy(habit._id)}
                                                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition-all hover:scale-105"
                                            >
                                                📋 Copiar
                                            </button>
                                        )}
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
                            Registro necesario
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
                                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium shadow-md transition-all hover:scale-105"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => navigate('/auth/register')}
                                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para ver todas las tareas */}
            {showTasksModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                📋 Tareas de: {selectedHabitName}
                            </h2>
                            <button
                                onClick={() => setShowTasksModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedHabitTasks.map((task, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl hover:shadow-md transition-all"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-800 font-medium flex-1 pt-1">
                                        {task}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => setShowTasksModal(false)}
                            className="w-full mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para compartir hábito existente */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Compartir hábito
                        </h2>
                        <form onSubmit={handleShareHabit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Selecciona un hábito de tu lista
                                </label>
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
                                    <select
                                        value={selectedHabitToShare}
                                        onChange={(e) => setSelectedHabitToShare(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                        required
                                    >
                                        <option value="">-- Selecciona un hábito --</option>
                                        {myHabits.map(habit => (
                                            <option key={habit._id} value={habit._id}>
                                                {habit.nombre} ({habit.categoria})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {myHabits.length > 0 && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedHabitToShare('');
                                        }}
                                        className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                    >
                                        Compartir
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}