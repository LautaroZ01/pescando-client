import { Navigate, Outlet } from "react-router-dom"
import Loader from "../components/ui/Loader"
import { useAuth } from "../hooks/useAuth"

export default function DashboardLayout() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (!data) return <Navigate to='/' />

    return (
        <>
            <Outlet />
        </>
    )
}
