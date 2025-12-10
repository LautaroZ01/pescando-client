export default function Loader({size = "full"}) {

    if (size === "full") {
        return (
        <div className="fixed z-50 top-0 left-0 w-full h-screen grid place-items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
    )
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
    )
}
