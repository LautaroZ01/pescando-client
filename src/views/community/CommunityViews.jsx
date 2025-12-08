import { useState, useEffect } from 'react';
import { getCommunityHabits, publishHabit, toggleReaction, rateHabit, copyHabitToMyHabits, getMyPublishedHabits } from '../../API/CommunityAPI';

export default function CommunityView() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [showMyHabits, setShowMyHabits] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [newHabit, setNewHabit] = useState({
        nombre: '',
        descripcion: '',
        categoria: 'Estudio'
    });

    const categories = ['Todos', 'Estudio', 'Programación', 'Salud', 'Lectura', 'Otro'];

    useEffect(() => {
        fetchHabits();
    }, [selectedCategory, showMyHabits, sortBy]);

    const fetchHabits = async () => {
        setLoading(true);
        try {
            let data;
            if (showMyHabits) {
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
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        try {
            await publishHabit(newHabit);
            setNewHabit({ nombre: '', descripcion: '', categoria: 'Estudio' });
            setShowModal(false);
            fetchHabits();
        } catch (error) {
            console.error('Error al publicar:', error);
        }
    };

    const handleReaction = async (habitId, type) => {
        try {
            await toggleReaction(habitId, type);
            fetchHabits();
        } catch (error) {
            console.error('Error al reaccionar:', error);
        }
    };

    const handleRate = async (habitId, stars) => {
        try {
            await rateHabit(habitId, stars);
            fetchHabits();
        } catch (error) {
            console.error('Error al valorar:', error);
        }
    };

    const handleCopy = async (habitId) => {
        console.log(habitId)
        try {
            await copyHabitToMyHabits(habitId);
            alert('¡Hábito copiado a tus hábitos personales!');
        } catch (error) {
            console.error('Error al copiar:', error);
            alert('Error al copiar el hábito');
        }
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
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-orange-200 via-rose-200 to-red-200 shadow-lg flex flex-col items-center py-8 gap-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">❤️</span>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">🏆</span>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">📊</span>
                </div>
                <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">🌐</span>
                </div>
                <div className="mt-auto w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition">
                    <span className="text-2xl">👤</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-20 p-8">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🎣</span>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Comunidad Pescando
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Filtros y Acciones */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    {/* Categorías */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map(cat => (
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
                                onClick={() => {
                                    setShowMyHabits(!showMyHabits);
                                    setSelectedCategory('Todos');
                                }}
                                className={`px-5 py-2 rounded-full font-medium transition-all ${
                                    showMyHabits
                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {showMyHabits ? '🌐 Ver todos' : '📝 Mis hábitos'}
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
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

            {/* Modal para agregar hábito */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Compartir hábito
                        </h2>
                        <form onSubmit={handlePublish}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nombre del hábito
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newHabit.nombre}
                                    onChange={(e) => setNewHabit({ ...newHabit, nombre: e.target.value })}
                                    placeholder="Ej: Hacer ejercicio diario"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Descripción (opcional)
                                </label>
                                <textarea
                                    value={newHabit.descripcion}
                                    onChange={(e) => setNewHabit({ ...newHabit, descripcion: e.target.value })}
                                    placeholder="Describe tu hábito..."
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={newHabit.categoria}
                                    onChange={(e) => setNewHabit({ ...newHabit, categoria: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                >
                                    <option value="Estudio">Estudio</option>
                                    <option value="Programación">Programación</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Lectura">Lectura</option>
                                    <option value="Otro">Otro</option>
                                </select>
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
                                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                                >
                                    Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}