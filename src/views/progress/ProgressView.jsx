import { useEffect, useState } from "react";
import CategoryPieChart from "./CategoryPieChart";
import HabitsCharts from "./HabitsChart";
import PerformanceRadar from "./PerformanceRadar"
import { IoIosStats, IoMdCheckmarkCircle, IoMdFlame, IoMdTrophy } from "react-icons/io";
import StatCard from "../../components/ui/StatCard";
import { getHistoryStats, getStats } from "../../API/HabitAPI";
import WeeklyProgressChart from "./WeeklyProgressChart";
import { FaCalendarAlt } from "react-icons/fa"

export default function ProgressView() {

    const [stats, setStats] = useState(null)
    const [weeklyData, setWeeklyData] = useState([])
    const [loadingHistory, setLoadingHistory] = useState(null)

    const [dateRange, setDateRange] = useState({ from: '', to: '' })
 
    useEffect(() => {
        loadDashboardData();
    }, [dateRange]); // <-- Se ejecuta cada vez que cambian las fechas

    const loadDashboardData = async () => {
        try {
            setLoadingHistory(true);
    
            getStats().then(setStats).catch(console.error);

            // Si las fechas están vacías, la API usa la lógica por defecto (7 días)
            const history = await getHistoryStats(dateRange.from, dateRange.to);
            setWeeklyData(history.weeklyData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    }

    const getChartSubtitle = () => {
        if (dateRange.from && dateRange.to) {
            const format = (dateStr) => dateStr.split('-').reverse().slice(0, 2).join('/');
            return `Del ${format(dateRange.from)} al ${format(dateRange.to)}`;
        }
        return "Últimos 7 días";
    }

    return (
        <div className="w-full lg:p-8 rounded-3xl min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Mi Progreso</h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Analiza tu rendimiento y descubre tus patrones de éxito.
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Efectividad Hoy" 
                        value={`${stats?.progressToday || 0}%`} 
                        subtext="vs semana pasada" 
                        icon={<IoMdCheckmarkCircle size={24} />}
                        theme="green"
                    />
                    <StatCard 
                        title="Mejor Racha" 
                        value={stats?.maxStreak || 0} 
                        subtext="días consecutivos" 
                        icon={<IoMdFlame size={24} />}
                        theme="orange"
                    />
                    <StatCard 
                        title="Tareas Totales" 
                        value={stats?.completedHabits || 0} 
                        subtext="completadas este mes" 
                        icon={<IoMdTrophy size={24} />}
                        theme="purple"
                    />
                    <StatCard 
                        title="Hábitos Activos" 
                        value={stats?.totalHabits || 0} 
                        subtext="en seguimiento" 
                        icon={<IoIosStats size={24} />}
                        theme="blue"
                    />
                </div>

                

                {/* Gráficos principales */}
                <div className="space-y-8 mt-4 w-full">
                    <div className="w-full space-y-3">
                        <div className="flex justify-end">
                            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl">
                                    <span className="text-orange-400"><FaCalendarAlt /></span>
                                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Filtrar</span>
                                </div>
                                
                                <input 
                                    type="date" 
                                    className="text-sm text-gray-600 outline-none bg-transparent font-medium p-1 cursor-pointer"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                />
                                <span className="text-gray-300 font-light">|</span>
                                <input 
                                    type="date" 
                                    className="text-sm text-gray-600 outline-none bg-transparent font-medium p-1 cursor-pointer"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                />
                                
                                {/* Botón X para limpiar (solo aparece si hay fechas) */}
                                {(dateRange.from || dateRange.to) && (
                                    <button 
                                        onClick={() => setDateRange({ from: '', to: '' })}
                                        className="ml-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition"
                                        title="Limpiar filtro"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* El Gráfico */}
                        <WeeklyProgressChart data={weeklyData} loading={loadingHistory} subtitle={getChartSubtitle()} />
                    </div>
                    {/* Fila Superior: Rendimiento Diario (Ancho Completo) */}
                    <div>
                        <HabitsCharts />
                    </div>

                    {/* Fila Inferior: Distribución y Equilibrio */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CategoryPieChart />
                        <PerformanceRadar />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}