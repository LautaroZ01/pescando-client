import { Navigate, Outlet } from "react-router"
import Loader from "../components/ui/Loader"
import { useAuth } from "../hooks/useAuth"
import SideBar from "../components/ui/SideBar"
import Header from "../components/Header"

export default function DashboardLayout() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (!data) return <Navigate to='/' />

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200">
            <div className="flex h-screen">
                <div className="h-full p-4">
                    <SideBar />
                </div>
                <div className="grow h-full overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}