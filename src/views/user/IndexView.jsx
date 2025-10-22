import Loader from "../../components/ui/Loader"
import { useAuth } from "../../hooks/useAuth"

export default function IndexView() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <Loader />

    if (data) return (
        <>
            <h1 className="text-2xl font-bold">Bienvenido {data.firstname}</h1>
        </>
    )
}
