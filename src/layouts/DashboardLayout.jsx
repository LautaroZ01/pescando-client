import { Navigate, Outlet } from "react-router"
import Loader from "../components/ui/Loader"
import { useAuth } from "../hooks/useAuth"
import Header from "../components/Header";

export default function DashboardLayout() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (!data) return <Navigate to='/' />

    return (
        <div className="min-h-screen flex flex-col">
            
            <Header />

            {/* Contenido dinámico */}
            <main className="flex-1">
                <Outlet />
            </main>

        </div>
    )
}
