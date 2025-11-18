import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
    const { data, isLoading, logout } = useAuth()


    if (isLoading) return null

    return (
        <header>
            <div className={`flex items-center justify-between container mx-auto p-4 top-4 lg:px-8 z-50 ${location.pathname === '/' ? 'fixed inset-x-0' : 'sticky'} backdrop-blur-md bg-white/20 rounded-full`}>
                <Link to="/">
                    🦈
                </Link>
                {data ? (
                    <div className="flex gap-4">
                        <Link to='/dashboard'>{data.firstname}</Link>
                        <button onClick={logout} className='cursor-pointer'>Cerrar Sesión</button>
                    </div>
                ) : (
                    <nav className="flex gap-4">
                        <Link to="/auth/login" className='px-8 py-2 rounded-full hover:scale-105 transition duration-pro'>Iniciar Sesión</Link>
                        <Link to="/auth/register" className='px-8 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-105 transition-transform duration-pro'>Registrarse</Link>
                    </nav>
                )}
            </div>
        </header>
    )
}

