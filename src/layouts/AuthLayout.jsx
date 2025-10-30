import { Navigate, Outlet } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import { useAuth } from '../hooks/useAuth'

export default function AuthLayout() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (data) return <Navigate to='/' />

    return (
        <main className='min-h-screen flex items-center justify-center p-4 bg-radial-animated'>
            <Outlet />
        </main>
    )
}
