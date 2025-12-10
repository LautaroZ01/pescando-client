import { BsStars } from "react-icons/bs";
import { Link } from "react-router";

export default function GenerateRoutine() {
    return (
        <Link
            to={location.pathname + '?isOpen=true'}
            className="absolute bottom-4 right-4 flex items-center rounded-full p-3 shadow-lg group transition-all duration-300 hover:pr-5 bg-white cursor-pointer"
        >
            <div className="relative flex items-center justify-center">
                <BsStars className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400" style={{ fill: "url(#gradient)" }} />
                <svg width="0" height="0">
                    <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop stopColor="#fb923c" offset="0%" />
                        <stop stopColor="#f87171" offset="100%" />
                    </linearGradient>
                </svg>
            </div>
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[10rem] group-hover:opacity-100 group-hover:ml-2 text-gray-700 font-medium">
                Generar rutina
            </span>
        </Link>
    )
}
