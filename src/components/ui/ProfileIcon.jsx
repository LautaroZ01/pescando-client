import { FaRegUser } from "react-icons/fa"

const SIZE_MAP = {
    md: "w-12 h-12",
    xl: "w-32 h-32"
}

export default function ProfileIcon({
    src, 
    alt="Avatar",
    size = "xl",
    className = ""}) {


    const sizeClasses = SIZE_MAP[size] || SIZE_MAP['sm']

    const baseClasses = `rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-300 to-pink-300 shadow-md ${sizeClasses} ${className}`;

    if (src) {
        return (
            <div className={baseClasses}>
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-cover" 
                />
            </div>
        );
    }

    // Si no hay imagen, mostramos el ícono por defecto
    return (
        <div className={baseClasses}>
            {/* El ícono se ajusta al 50% del tamaño del contenedor para que respire */}
            <FaRegUser className="w-1/2 h-1/2 text-white/80" />
        </div>
    );
}