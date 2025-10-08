import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/ui/Loader'

export default function AuthLayout() {
    const {data, isLoading} = useAuth()
    
    if(isLoading) return <Loader />

    if(data) return <Navigate to='/' />

    return (
        <main className='min-h-screen flex items-center justify-center p-4'>
            <div>
                <Outlet />
            </div>
        </main>
    )
}
