import { Link } from "react-router"
import Loader from "../../components/ui/Loader"
import { useAuth } from "../../hooks/useAuth"

export default function IndexView() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (data) return (
        <div className="min-h-[120vh] grid place-items-center content-center gap-4">
            <h1 className="text-2xl font-bold">Bienvenido {data.firstname}</h1>
            <Link to="/">Volver</Link>
        </div>
    )
}
