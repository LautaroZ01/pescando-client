import Loader from "./ui/Loader";
import { IoIosStats } from "react-icons/io";

export default function ChartCard({
    title, 
    icon, 
    subtitle, 
    children,
    isLoading, 
    isEmpty, 
    emptyMessage = "No hay datos disponibles", 
    className = '',
    height = "h-[400px]"
}) {
    return (
        <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col ${height} ${className}`}>
            {/* Header del Gráfico */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-orange-500 text-xl">{icon}</span>}
                    <h3 className="text-xl font-bold text-gray-800 relative group cursor-default">
                        {title}
                        <span className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </h3>
                </div>
                {subtitle && <p className="text-sm text-gray-500 ml-8 mt-1">{subtitle}</p>}
            </div>

            {/* Contenido: Carga, Vacío o Gráfico */}
            <div className="flex-1 min-h-0 w-full relative">
                {isLoading ? (
                    
                    <div className="absolute inset-0 bg-white/80 z-10 rounded-xl">
                        <Loader size="small" />
                    </div>
                ) : isEmpty ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                        <span className="text-4xl mb-2">
                            <IoIosStats className="h-8 w-8 text-orange-500"/>
                        </span>
                        <p className="text-gray-400 font-medium">{emptyMessage}</p>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    )
}