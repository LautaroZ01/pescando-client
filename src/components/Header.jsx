import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { LuLogOut, LuMenu, LuX } from 'react-icons/lu'
import { GiBoatFishing } from "react-icons/gi";
import { FaFishFins } from "react-icons/fa6";
import ProfileIcon from './ui/ProfileIcon'

export default function Header() {
    const { data, isLoading, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false) // Profile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Mobile menu state

    const links = [
        { href: '#features', label: 'Características' },
        { href: '#community', label: 'Comunidad' },
        { href: '#cta', label: 'Empezar' },
    ]

    const profileLinks = [
        { href: '/profile', label: 'Perfil', Icon: FaUser },
        { href: '/dashboard', label: 'Dashboard', Icon: GiBoatFishing },
        { href: '/community', label: 'Comunidad', Icon: FaFishFins },
    ]

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    if (isLoading) return null

    return (
        <header className='px-4 lg:px-10'>
            <div className={`flex items-center justify-between container mx-auto p-2 top-4 lg:px-8 z-50 ${(location.pathname === '/' || location.pathname === '/community') ? 'fixed inset-x-0' : 'sticky'} backdrop-blur-md bg-white/20 rounded-full`}>
                {/* Logo */}
                <Link to="/" className='min-w-fit z-50'>
                    <img src="/pezicon.png" alt="Pescando Icono" className='size-8' />
                </Link>

                {data ? (
                    <div className='relative'>
                        <button className="flex gap-4 cursor-pointer" onClick={toggleMenu}>
                            <div>
                                <ProfileIcon
                                    src={data?.photo}
                                    lt='Foto de perfil'
                                    size='sm'
                                />
                            </div>
                        </button>

                        <nav onMouseLeave={toggleMenu} className={`${isOpen ? 'block' : 'hidden'} absolute right-0 top-full mt-1 bg-white backdrop-blur-2xl shadow-lg rounded-md min-w-64 flex flex-col gap-6 p-4 menu-animation`}>
                            <div className='flex items-center gap-2 border-b border-gray-200/80 group transition-all duration-pro'>
                                <ProfileIcon
                                    src={data?.photo}
                                    lt='Foto de perfil'
                                    size='sm'
                                />
                                <div className='flex flex-col group-hover:text-orange-400 transition-all duration-pro'>
                                    <strong>{data.firstname} {data.lastname}</strong>
                                    <span>{data.email}</span>
                                </div>
                            </div>

                            {profileLinks.map((link, index) => (
                                <Link key={index} to={link.href} className='flex items-center gap-4 hover:text-orange-400 group transition-all duration-pro'>
                                    <link.Icon className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            <button onClick={logout} className='flex items-center gap-4 border-t border-gray-200/80 pt-4 hover:text-orange-400 group transition-all duration-pro cursor-pointer'>
                                <LuLogOut className='text-gray-600 group-hover:text-orange-400 transition duration-pro' />
                                <span>Cerrar Sesión</span>
                            </button>
                        </nav>
                    </div>
                ) : (
                    <>
                        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 items-center">
                            {links.map((link, index) => (
                                <a key={index} href={link.href} className='rounded-full hover:scale-105 transition duration-pro font-medium text-gray-700 hover:text-gray-800'>{link.label}</a>
                            ))}
                        </nav>

                        <div className='hidden md:flex gap-4 items-center justify-center'>
                            <Link to="/auth/login" className='px-6 py-2 rounded-full hover:scale-105 transition duration-pro text-gray-700 hover:text-gray-800'>Iniciar Sesión</Link>
                            <Link to="/auth/register" className='px-6 py-2 btn-primary'>Registrarse</Link>
                        </div>

                        <div className="md:hidden flex items-center z-50">
                            <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
                                {isMobileMenuOpen ? <LuX size={28} /> : <LuMenu size={28} />}
                            </button>
                        </div>

                        {isMobileMenuOpen && (
                            <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl flex flex-col gap-6 menu-animation border border-gray-100">
                                <div className="flex flex-col gap-4 items-center">
                                    {links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.href}
                                            className='text-lg font-medium text-gray-700 hover:text-orange-500 transition duration-pro'
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-200 w-full"></div>
                                <div className='flex flex-col gap-3 w-full'>
                                    <Link
                                        to="/auth/login"
                                        className='w-full text-center py-2 rounded-full hover:bg-gray-50 transition duration-pro text-gray-700 font-medium'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/auth/register"
                                        className='w-full text-center py-2 btn-primary'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    )
}

