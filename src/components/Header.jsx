import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
    const { data, isLoading, logout } = useAuth()

    if (isLoading) return null

    return (
        <header>
            <div className="flex justify-between max-w-7xl mx-auto p-6">
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
                        <Link to="/auth/login">Iniciar Sesión</Link>
                        <Link to="/auth/register">Registrarse</Link>
                    </nav>
                )}
            </div>
        </header>
    )
}

