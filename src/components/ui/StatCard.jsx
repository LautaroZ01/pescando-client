export default function StatCard({ title, value, subtext, icon, theme }) {
    // Definimos los temas de colores (gradientes suaves)
    const themes = {
        green: "from-emerald-400 to-teal-500 shadow-emerald-200",
        orange: "from-orange-400 to-amber-500 shadow-orange-200",
        purple: "from-purple-400 to-fuchsia-500 shadow-purple-200",
        blue: "from-blue-400 to-cyan-500 shadow-blue-200",
        pink: "from-pink-400 to-rose-500 shadow-pink-200"
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg bg-gradient-to-br ${themes[theme] || themes.blue} transition-transform hover:scale-105 duration-300`}>
            
            <div className="flex justify-between items-start mb-4">
                {/* Icono con fondo translúcido */}
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    {icon}
                </div>
                {/* Valor Principal */}
                <span className="text-4xl font-bold">{value}</span>
            </div>
            
            <div>
                <h3 className="font-semibold text-lg opacity-95">{title}</h3>
                {subtext && <p className="text-sm opacity-80 mt-1 font-medium">{subtext}</p>}
            </div>

            {/* Decoración de fondo (círculo sutil) */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>
    );
}