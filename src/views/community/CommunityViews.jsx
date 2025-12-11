import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { getCommunityHabits, toggleReaction, rateHabit, copyHabitToMyHabits, shareMyHabit } from '../../API/CommunityAPI';
import { getHabits } from '../../API/HabitAPI';
import { useAuth } from '../../hooks/useAuth';
import { getCategories } from '../../API/CategoryAPI';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react'; 
import { FaHeart, FaRegHeart, FaThumbsUp, FaRegThumbsUp, FaStar, FaRegStar } from "react-icons/fa";

export default function CommunityView() {
    const navigate = useNavigate();
    
    // Auth Data
    const { data: userData, isError, isLoading: authLoading } = useAuth(); // Agregamos authLoading
    const isAuthenticated = !isError && userData;

    // Estados de datos
    const [habits, setHabits] = useState([]);
    const [myHabits, setMyHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [sortBy, setSortBy] = useState('recent');

    // Modales
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    
    // Modal Copiar
    const [copyModal, setCopyModal] = useState({ isOpen: false, habitId: null, habitName: '' });
    const [copying, setCopying] = useState(false);

    // Modal Mensajes (Éxito/Error)
    const [messageModal, setMessageModal] = useState({ 
        isOpen: false, 
        type: 'success', 
        title: '', 
        message: '' 
    });

    // --- CORRECCIÓN 3: LIKES AL RECARGAR ---
    // Agregamos 'authLoading' a las dependencias.
    // Solo hacemos fetch cuando terminamos de saber si hay usuario o no.
    useEffect(() => {
        if (!authLoading) {
            fetchHabits();
        }
    }, [selectedCategory, sortBy, userData, authLoading]); 

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
            // Si el usuario existe, enviamos su ID para que el backend sepa qué likes pintarle
            if (userData?._id) { 
                params.userId = userData._id;
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

    const sortedHabits = useMemo(() => {
        let sorted = [...habits];
        switch (sortBy) {
            case 'rating':
                return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case 'popular':
                return sorted.sort((a, b) => {
                    const popA = (a.reactionsCount?.hearts || 0) + (a.reactionsCount?.likes || 0);
                    const popB = (b.reactionsCount?.hearts || 0) + (b.reactionsCount?.likes || 0);
                    return popB - popA;
                });
            case 'recent':
            default:
                return sorted; 
        }
    }, [habits, sortBy]);

    const loadMyPersonalHabits = async () => {
        try {
            const data = await getHabits();
            setMyHabits(data || []);
        } catch (error) {
            console.error('Error al cargar mis hábitos:', error);
            setMyHabits([]);
        }
    };

    const requireAuth = (message) => {
        setAuthMessage(message);
        setShowAuthModal(true);
    };

    const handleRate = async (habitId, stars) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para valorar hábitos');
            return;
        }

        // --- CORRECCIÓN 1: ACTUALIZACIÓN DE ESTRELLAS ---
        // Forzamos la actualización del 'userRating' en el estado local
        setHabits(currentHabits => currentHabits.map(habit => {
            if (habit._id === habitId) {
                return { 
                    ...habit, 
                    userRating: stars // Esto asegura que la estrella se pinte inmediatamente
                };
            }
            return habit;
        }));

        try {
            await rateHabit(habitId, stars);
        } catch (error) {
            console.error('Error al valorar:', error);
            fetchHabits(); // Si falla, revertimos recargando
        }
    };

    const handleReaction = async (habitId, type) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para reaccionar a los hábitos');
            return;
        }

        setHabits(currentHabits => currentHabits.map(habit => {
            if (habit._id === habitId) {
                const isHeart = type === 'heart';
                const wasActive = isHeart ? habit.userHasHearted : habit.userHasLiked;
                let newHeartCount = habit.reactionsCount?.hearts || 0;
                let newLikeCount = habit.reactionsCount?.likes || 0;

                if (isHeart) {
                    newHeartCount = wasActive ? newHeartCount - 1 : newHeartCount + 1;
                } else {
                    newLikeCount = wasActive ? newLikeCount - 1 : newLikeCount + 1;
                }

                return {
                    ...habit,
                    userHasHearted: isHeart ? !habit.userHasHearted : habit.userHasHearted,
                    userHasLiked: !isHeart ? !habit.userHasLiked : habit.userHasLiked,
                    reactionsCount: { hearts: newHeartCount, likes: newLikeCount }
                };
            }
            return habit;
        }));

        try {
            await toggleReaction(habitId, type);
        } catch (error) {
            console.error('Error al reaccionar:', error);
            fetchHabits();
        }
    };

    const handleShareButtonClick = () => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para compartir tus hábitos con la comunidad');
            return;
        }
        loadMyPersonalHabits();
        setShowShareModal(true);
    };

    // --- CORRECCIÓN 2: MANEJO DE MODALES ---
    const handleShareExisting = async (habitId) => {
        try {
            await shareMyHabit(habitId);
            setShowShareModal(false); // Cerramos lista
            
            setMessageModal({
                isOpen: true,
                type: 'success',
                title: '¡Publicado!',
                message: 'Tu hábito ha sido publicado en la comunidad exitosamente.'
            });
            
            fetchHabits();
        } catch (error) {
            console.error('Error al compartir:', error);
            
            // PRIMERO cerramos el modal de selección para que no tape al de error
            setShowShareModal(false); 

            // LUEGO abrimos el modal de error
            setMessageModal({
                isOpen: true,
                type: 'error',
                title: 'No se pudo compartir',
                message: error.response?.data?.error || 'Este hábito ya existe en la comunidad o hubo un error.'
            });
        }
    };

    const handleRequestCopy = (habit) => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para copiar hábitos a tu cuenta');
            return;
        }
        setCopyModal({ isOpen: true, habitId: habit._id, habitName: habit.nombre });
    };

    const confirmCopy = async () => {
        if (!copyModal.habitId) return;
        setCopying(true);
        try {
            await copyHabitToMyHabits(copyModal.habitId);
            setCopyModal({ isOpen: false, habitId: null, habitName: '' });
            setMessageModal({
                isOpen: true,
                type: 'success',
                title: '¡Copiado!',
                message: 'El hábito se ha añadido correctamente a tu lista personal.'
            });
            fetchHabits(); 
        } catch (error) {
            console.error('Error al copiar:', error);
            // Cerramos modal de copiado por si acaso
            setCopyModal({ isOpen: false, habitId: null, habitName: '' });
            setMessageModal({
                isOpen: true,
                type: 'error',
                title: 'Error al copiar',
                message: error.response?.data?.error || 'No se pudo copiar el hábito.'
            });
        } finally {
            setCopying(false);
        }
    };

    const handleGoToMyHabits = () => {
        if (!isAuthenticated) {
            requireAuth('Debes iniciar sesión para gestionar tus hábitos personales');
            return;
        }
        navigate('/dashboard/habits');
    };

    // --- CORRECCIÓN 1 (Visual): COMPONENTE STAR RATING ---
    const StarRating = ({ habitId, currentRating, userRating }) => {
        const [hoveredStar, setHoveredStar] = useState(0);

        return (
            <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => {
                        // Lógica prioritaria: 
                        // 1. Si hay hover, usa hover.
                        // 2. Si no, si hay voto del usuario (>0), usa el voto del usuario.
                        // 3. Si no, usa el promedio general.
                        const ratingToShow = hoveredStar > 0 
                            ? hoveredStar 
                            : (userRating > 0 ? userRating : Math.round(currentRating));

                        const isFilled = star <= ratingToShow;

                        return (
                            <button
                                key={star}
                                onClick={() => handleRate(habitId, star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="text-lg transition-transform hover:scale-125 focus:outline-none"
                            >
                                {isFilled ? (
                                    <FaStar className="text-yellow-400 drop-shadow-sm" />
                                ) : (
                                    <FaRegStar className="text-gray-300" />
                                )}
                            </button>
                        );
                    })}
                </div>
                {/* Mostramos el promedio numérico siempre */}
                <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    {currentRating ? currentRating.toFixed(1) : '0.0'}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-200 to-pink-200 pt-28">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Título */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
                        Explora nuestra <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Comunidad</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubre nuevos hábitos, inspírate con el progreso de otros y comparte tu camino hacia el éxito.
                    </p>
                </div>

                {/* Filtros */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categoriesLoading ? (
                             <div className="flex items-center gap-2">
                                <span className="animate-pulse">Cargando categorías...</span>
                                <span className="animate-spin"><Loader2 size={16}/></span>
                            </div>
                        ) : (
                            <>
                            <button
                                onClick={() => setSelectedCategory('Todos')}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === 'Todos'
                                    ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md' // Estilo Activo
                                    : 'bg-white text-gray-700 hover:bg-gray-100' // Estilo Inactivo
                                    }`}
                            >
                                Todos
                            </button>

                            {categoriesData.map((cat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === cat.name ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                         <div className="flex gap-2">
                            <button onClick={() => setSortBy('recent')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'recent' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>🕒 Recientes</button>
                            <button onClick={() => setSortBy('rating')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'rating' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>⭐ Mejor valorados</button>
                            <button onClick={() => setSortBy('popular')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === 'popular' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>🔥 Populares</button>
                        </div>
                        <div className="flex gap-3">
                            {isAuthenticated ? (
                                <>
                                    <button onClick={handleGoToMyHabits} className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium shadow-md transition-all hover:scale-105">📝 Mis Hábitos</button>
                                    <button onClick={handleShareButtonClick} className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105">➕ Compartir mis hábitos</button>
                                </>
                            ) : (
                                <button onClick={() => requireAuth('Debes iniciar sesión para interactuar con los hábitos')} className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105">🔐 Inicia sesión para interactuar</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl font-bold text-orange-500 flex gap-2 items-center">
                            <Loader2 className="animate-spin" size={32}/> Cargando...
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedHabits.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <p className="text-2xl text-gray-500">🌐 No hay hábitos en esta categoría</p>
                            </div>
                        ) : (
                            sortedHabits.map(habit => (
                                <div key={habit._id} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all border border-white/50">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-sm">{habit.categoria.name}</span>
                                        {habit.copiedCount > 0 && <span className="text-xs text-gray-500 font-medium">📋 {habit.copiedCount}</span>}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate" title={habit.nombre}>{habit.nombre}</h3>
                                    {habit.descripcion && <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">{habit.descripcion}</p>}
                                    
                                    <div className="mb-4">
                                        <StarRating habitId={habit._id} currentRating={habit.averageRating} userRating={habit.userRating} />
                                        <span className="text-xs text-gray-500 mt-1 block pl-1">{habit.totalRatings} valoraciones</span>
                                    </div>
                                    
                                    <div className="flex gap-4 mb-4 pt-2 border-t border-gray-100">
                                        <button onClick={() => handleReaction(habit._id, 'heart')} className="flex items-center gap-2 group transition-transform active:scale-95">
                                            {habit.userHasHearted ? (
                                                <FaHeart className="text-red-500 text-xl drop-shadow-sm transition-all scale-110" />
                                            ) : (
                                                <FaRegHeart className="text-gray-400 text-xl group-hover:text-red-400 transition-colors" />
                                            )}
                                            <span className={`text-sm font-medium ${habit.userHasHearted ? 'text-red-500' : 'text-gray-500'}`}>{habit.reactionsCount?.hearts || 0}</span>
                                        </button>
                                        <button onClick={() => handleReaction(habit._id, 'like')} className="flex items-center gap-2 group transition-transform active:scale-95">
                                            {habit.userHasLiked ? (
                                                <FaThumbsUp className="text-blue-500 text-xl drop-shadow-sm transition-all scale-110" />
                                            ) : (
                                                <FaRegThumbsUp className="text-gray-400 text-xl group-hover:text-blue-400 transition-colors" />
                                            )}
                                            <span className={`text-sm font-medium ${habit.userHasLiked ? 'text-blue-500' : 'text-gray-500'}`}>{habit.reactionsCount?.likes || 0}</span>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-white text-xs font-bold">{habit.userName?.charAt(0).toUpperCase() || '?'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-700 font-bold leading-tight">{habit.userName || 'Anónimo'}</span>
                                                <span className="text-[10px] text-gray-500">Autor</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRequestCopy(habit)} className="text-xs px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition-all hover:scale-105 flex items-center gap-1 shadow-sm">
                                            📋 Copiar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* --- MODALES --- */}

            {/* Modal Copiar */}
            {copyModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="text-5xl mb-4">📋</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Copiar hábito?</h2>
                            <p className="text-gray-600 mb-6">Copiarás <strong>"{copyModal.habitName}"</strong> a tu dashboard.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setCopyModal({ isOpen: false, habitId: null, habitName: '' })} disabled={copying} className="flex-1 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Cancelar</button>
                                <button onClick={confirmCopy} disabled={copying} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium shadow-md transition-all hover:scale-105">
                                    {copying ? 'Copiando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CORRECCIÓN 2: Modal Genérico con Z-INDEX ALTO */}
            {messageModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4 animate-bounce">
                            {messageModal.type === 'success' ? '🎉' : '⚠️'}
                        </div>
                        <h2 className={`text-2xl font-bold mb-4 ${messageModal.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {messageModal.title}
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">{messageModal.message}</p>
                        <button 
                            onClick={() => setMessageModal({ ...messageModal, isOpen: false })}
                            className={`w-full px-6 py-3 rounded-full font-bold shadow-md transition-all hover:scale-105 text-white ${
                                messageModal.type === 'success' 
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600' 
                                    : 'bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600'
                            }`}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Auth */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso requerido</h2>
                        <p className="text-gray-600 mb-6">{authMessage}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAuthModal(false)} className="flex-1 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Cancelar</button>
                            <button onClick={() => navigate('/auth/login')} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105">Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Selección Compartir */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Compartir a la comunidad</h2>
                        <p className="text-gray-500 mb-6">Elige cuál de tus hábitos quieres hacer público.</p>
                        
                        {myHabits.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">No tienes hábitos creados.</p>
                                <button type="button" onClick={handleGoToMyHabits} className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-medium">Crear hábito</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myHabits.map(habit => (
                                    <div key={habit._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex justify-between items-center group">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors">{habit.nombre}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">{habit.categoria.name}</span>
                                        </div>
                                        <button onClick={() => handleShareExisting(habit._id)} className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-medium border border-orange-200 hover:bg-orange-500 hover:text-white transition-all">📤 Compartir</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <button onClick={() => setShowShareModal(false)} className="w-full px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}