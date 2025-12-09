import { useEffect, useState } from 'react';
import { changeProfilePhoto, getProfile, updateProfile, uploadImageToCloudinary } from '../../API/UserAPI';
import { FaCamera, FaRegUser } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ProfileIcon from '../../components/ui/ProfileIcon';
import HabitsCharts from './HabitsChart';
import { getStats } from '../../API/HabitAPI';
import CategoryPieChart from './CategoryPieChart';


export default function ProfileView() {
    const defaultVariables = {
        firstname: '',
        lastname: '',
        email: '',
        photo: null,
    }

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm(defaultVariables)
    const queryClient = useQueryClient()

    const watchFirstname = watch('firstname')
    const watchLastname = watch('lastname')

    const { data: userData, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getProfile 
    });

    useEffect(() => {
        if (userData) {
            reset({
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                email: userData.email || '',
                photo: userData.photo || FaRegUser ,
            });
        }
    }, [userData, reset]);

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Perfil actualizado con éxito');
            queryClient.invalidateQueries({ queryKey: ['userProfile']})
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const handleUpdateProfile = (FormData) => mutate(FormData)

    const { mutate: handlePhotoChange, isPending: isUploading } = useMutation({
        mutationFn: async (file) => {
            // A. Subir a la Nube 
            const { secure_url, public_id } = await uploadImageToCloudinary(file);
            
            // B. Guardar URL en tu Base de Datos 
            return await changeProfilePhoto({ 
                photo: secure_url, 
                public_id: public_id 
            });
        },
        onError: (error) => toast.error("Error al actualizar la foto", error),
        onSuccess: () => {
            toast.success("Foto actualizada correctamente");
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // Refresca la pantalla
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    });

    // Función del Input
    const onFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handlePhotoChange(file); // ¡Dispara la cadena!
        }
    };
    const [activeTab, setActiveTab] = useState('perfil')
    const [stats, setStats] = useState(null)

    useEffect(() => {
        if (activeTab === 'gráficas') {
            getStats()
                .then(data => setStats(data))
                .catch(error => console.error("Error cargando stats:", error))
        }
    }, [activeTab])

    // Pantalla de carga
    if (isLoading) {
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
    const userPhoto = userData?.photo

    const fullName = `${watchFirstname || userData.firstname || ''} ${watchLastname || userData.lastname || ''}`.trim()

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200 p-6">
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='bg-gradient-to-r from-orange-200 to-pink-200 rounded-3xl p-8 mb-6 shadow-lg'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-3xl font-bold text-orange-600'>Mi perfil</h1>
                    </div>

                    {/* Foto de perfil */}
                    <div className='flex flex-col items-center mb-6'>
                        <div className='relative'>
                            <ProfileIcon
                                src = {userData?.photo}
                                alt = 'Foto de perfil'
                            />
                            <label className='absolute bottom-0 right-0 bg-orange-400 p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-500 transition-all' >
                                <FaCamera size={20} className='text-white'/>
                                <input 
                                    type="file" 
                                    className='hidden' 
                                    accept='image/*' 
                                    onChange={onFileSelect}
                                    disabled={isUploading}  />
                            </label>
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mt-4'>{fullName || 'Usuario'}</h2>
                        <p className='text-gray-600'>{userData.email}</p>
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
                        <form onSubmit={handleSubmit(handleUpdateProfile)} className='space-y-6'>
                            <div>
                                <label className='block text-gray-700 font-semibold mb-2'>Nombre</label>
                                <input type="text"
                                    id="firstname"
                                {...register('firstname', {
                                        required: 'El nombre es requerido',
                                        minLength: {
                                            value: 2,
                                            message: 'El nombre debe tener al menos 2 caracteres'
                                        }
                                    })}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none transition-all'/>
                                {errors.firstname && (
                                    <ErrorMessage>{errors.firstname.message}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <label className='block text-gray-700 font-semibold mb-2'>Apellido</label>
                                <input type="text"
                                    id="lastname"
                                {...register('lastname', {
                                        required: 'El apellido es requerido',
                                        minLength: {
                                            value: 2,
                                            message: 'El apellido debe tener al menos 2 caracteres'
                                        }
                                    })}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none transition-all'/>
                                {errors.lastname && (
                                    <ErrorMessage>{errors.lastname.message}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <label className='block text-gray-700 font-semibold mb-2'>Email</label>
                                <input type="email"
                                    id="email"
                                    readOnly
                                {...register('email')}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-600 focus:border-gray-400 outline-none transition-all' />
                            </div>
                            
                            <button type='submit' className='w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all cursor-pointer'>Guardar Cambios</button>
                        </form>
                    )}

                    {activeTab === 'gráficas' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* --- Sección de Tarjetas de Métricas  --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <div className="bg-gradient-to-br from-orange-100 to-white p-6 rounded-2xl shadow-sm">
                                    <p className="text-gray-500 text-sm font-medium">Total de Hábitos</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {stats ? stats.totalHabits : '-'}
                                    </p>
                                </div>
                                
                            </div>

                            {/* --- Sección de Gráficas --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                
                                {/* Gráfica de Barras (Izquierda) */}
                                <HabitsCharts />

                                {/* Gráfica de Pastel (Derecha) */}
                                <CategoryPieChart />
                                
                            </div>
                        </div>
                    )}

                </div>


            </div>
        </div>
    )
}