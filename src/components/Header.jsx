import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutUser } from '../API/AuthAPI'
import { toast } from 'react-toastify'


export default function Header() {
    const { data, isLoading } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: logoutUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.removeQueries({ queryKey: ['user'] })
            navigate('/')
        }
    })

    const handleSession = () => {
        mutate()
    }

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
                        <button onClick={handleSession} className='cursor-pointer'>Cerrar Sesión</button>
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

