import { useAuth } from "../../hooks/useAuth"
import { Navigate, Outlet } from "react-router"
import Loader from "../ui/Loader"

/**
 * Componente de Ruta Protegida por Roles.
 * Este componente verifica si el usuario está autenticado y tiene el rol permitido para acceder a la ruta.
 *
 * @param {object} props
 * @param {string[]} props.allowedRoles - Array de roles permitidos para esta ruta.
 */
export default function ProtectedRoute({ allowedRoles }) {
    const { data, isLoading } = useAuth()


    if (isLoading) {
        return <Loader />
    }
    // Verificar si el usuario está logueado
    if (!data) {
        return <Navigate to="/login" replace />
    }

    // Verificar si el rol del usuario está permitido
    if (allowedRoles && allowedRoles.includes(data.role)) {
        return <Outlet />
    } else {

        return <Navigate to="/404" replace />
    }
}