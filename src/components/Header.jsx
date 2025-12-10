import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'
import { GiBoatFishing } from "react-icons/gi";
import { FaFishFins } from "react-icons/fa6";

export default function Header() {
    const { data, isLoading, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    if (isLoading) return null

    return (
        <header className='px-10'>
            <div className={`flex items-center justify-between container mx-auto p-2 top-4 lg:px-8 z-50 ${location.pathname === '/' ? 'fixed inset-x-0' : 'sticky'} backdrop-blur-md bg-white/20 rounded-full`}>
                <Link to="/">
                    🎣
                </Link>
                {data ? (
                    <div className='relative'>
                        <button className="flex gap-4 cursor-pointer" onClick={toggleMenu}>
                            <div>
                                {data.photo ? <img src={data.photo} alt="" className='w-12 h-12 rounded-full' /> : <FaUser />}
                            </div>
                        </button>

                        <nav className={`${isOpen ? 'block' : 'hidden'} absolute right-0 top-full mt-1 bg-white backdrop-blur-2xl shadow-lg rounded-md min-w-64 flex flex-col gap-6 p-4 menu-animation`}>
                            <div className='flex items-center gap-2 border-b border-gray-200/80 py-4 group transition-all duration-pro'>
                                <div>
                                    {data.photo ? <img src={data.photo} alt="" className='w-12 h-12 rounded-full' /> : <FaUser />}
                                </div>
                                <div className='flex flex-col group-hover:text-orange-400 transition-all duration-pro'>
                                    <strong>{data.firstname} {data.lastname}</strong>
                                    <span>{data.email}</span>
                                </div>
                            </div>

                            <Link to="/profile" className='flex items-center gap-4 hover:text-orange-400 group transition-all duration-pro'>
                                <FaUser className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                <span>Perfil</span>
                            </Link>
                            <Link to="/dashboard" className='flex items-center gap-4 hover:text-orange-400 group transition-all duration-pro'>
                                <FaFishFins className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/community" className='flex items-center gap-4 hover:text-orange-400 group transition-all duration-pro'>
                                <GiBoatFishing className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                <span>Comunidad</span>
                            </Link>
                            <button onClick={logout} className='flex items-center gap-4 border-t border-gray-200/80 pt-4 hover:text-orange-400 group transition-all duration-pro cursor-pointer'>
                                <LuLogOut className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                <span>Cerrar Sesión</span>
                            </button>
                        </nav>
                    </div>
                ) : (
                    <nav className="flex">
                        <Link to="/community" className='px-8 py-2 rounded-full hover:scale-105 transition duration-pro'>Comunidad</Link>
                        <Link to="/auth/login" className='px-8 py-2 rounded-full hover:scale-105 transition duration-pro'>Iniciar Sesión</Link>
                        <Link to="/auth/register" className='px-8 py-2 btn-primary'>Registrarse</Link>
                    </nav>
                )}
            </div>
        </header>
    )
}

