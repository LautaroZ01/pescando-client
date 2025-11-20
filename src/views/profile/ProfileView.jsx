import { useState, useEffect } from 'react';
import { getProfile } from '../../API/UserAPI';
import { Bell, Camera } from 'lucide-react';
//import { User, Bell, Camera, TrendingUp, Filter, Calendar, Check, X } from 'lucide-react';


export default function ProfileView() {
    // Estado para guardar el usuario y el estado de carga
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('perfil')
    const [notifications, setNotifications] = useState(true); 
    const [error, setError] = useState(null)

    const [profile, setProfile] = useState({
        firstname: '',
        lastname:'',
        email:'',
        photo: null,
    })

    //useEffect se ejecuta cuando el componente se monta
     useEffect(() => {
        loadUserProfile();
    }, []);

    // Función para cargar el perfil del usuario
    const loadUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProfile();

            setProfile({
                firstname: data.firstname || '',
                lastname: data.lastname || '',
                email: data.email || '',
                photo: data.photo || null,
            })
        } catch (error) {
            console.error('Error al cargar perfil: ', error);
            setError('No se pudieron cargar los datos del perfil.');

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            };
        } finally {
            setLoading(false);
        }
    };

    // Pantalla de carga
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
            </div>
        </div>
        );
    }



    // --- Subtarea 4: Mostrar Foto o Avatar ---
    // (Añade una imagen de avatar por defecto en tu carpeta `public`)
    const defaultAvatar = '/default-avatar.png';
    const userPhoto = profile.photo ? profile.photo : defaultAvatar;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200 p-6">
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='bg-gradient-to-r from-orange-200 to-pink-200 rounded-3xl p-8 mb-6 shadow-lg'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-3xl font-bold text-orange-600'>Mi perfil</h1>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`p-3 rounded-full transition-all ${notifications ? 'bg-orange-400 text-white' : 'bg-white text-gray-400'}`}>
                            <Bell size={24} />
                        </button>
                    </div>

                    {/* Foto de perfil */}
                    <div className='flex flex-col items-center mb-6'>
                        <div className='relative'>
                            <div className='w-32 h-32 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center overflow-hidden shadow-xl'>
                                <img src={profile.photo} alt="Perfil" className='w-full h-full object-cover' />
                            </div>
                            <label className='absolute bottom-0 right-0 bg-orange-400 p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-500 transition-all' >
                                <Camera size={20} className='text-white'/>
                                <input type="file" className='hidden' accept='image/*' /*onChange={handlePhotoUpload}*/ />
                            </label>
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mt-4'>{profile.firstname}</h2>
                        <p className='text-gray-600'>{profile.email}</p>
                    </div>

                    <div className='flex gap-2 justify-center'>     {['perfil', 'gráficas', 'hábitos'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === tab
                                ? 'bg-orange-400 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-orange-100'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Contenido */}
                <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
                {activeTab === 'perfil' && (
                    <div className='space-y-6'>
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Nombre</label>
                            <input type="text"
                                id="firstname"
                                name= "firstname"
                                autoComplete='given-name'
                                value={profile.firstname}
                                onChange={(e) => setProfile({... profile, firstname:e.target.value })} 
                                className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none transition-all'/>
                        </div>
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Apellido</label>
                            <input type="text"
                                id="lastname"
                                name= "lastname"
                                autoComplete='family-name'
                                value={profile.lastname}
                                onChange={(e) => setProfile({... profile, lastname:e.target.value })} 
                                className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none transition-all'/>
                        </div>
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Email</label>
                            <input type="email"
                                id="email"
                                name="email"
                                autoComplete='email'
                                value={profile.email}
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none transition-all' />
                        </div>
                        <div className='flex items-center justify-between p-4 bg-orange-200 rounded-xl'>
                            <div className='flex items-center gap-3'>
                                <Bell size={24} className='text-orange-400 mb-2' />
                                <span className='font-semibold text-gray-700'>Notificaciones</span>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-14 h-8 rounded-full transition-all ${ notifications ? 'bg-orange-400' : 'bg-gray-300'}`}>
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${ notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <button className='w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all cursor-pointer'>Guardar Cambios</button>
                    </div>
                )}

                </div>




            </div>
        </div>
    )
}