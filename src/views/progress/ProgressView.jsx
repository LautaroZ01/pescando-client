import { useEffect, useState } from "react";
import CategoryPieChart from "./CategoryPieChart";
import HabitsCharts from "./HabitsChart";
import PerformanceRadar from "./PerformanceRadar"
import { IoIosStats, IoMdCheckmarkCircle, IoMdFlame, IoMdTrophy } from "react-icons/io";
import StatCard from "../../components/ui/StatCard";
import { getStats } from "../../API/HabitAPI";

export default function ProgressView() {

    const [stats, setStats] = useState(null)

    useEffect(()=>{
        getStats().then(setStats).catch(console.error)
    }, [])

    return (
        <div className=" in-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200  p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">Mi Progreso</h1>
                    <p className="text-gray-500 mt-2">Analiza tu rendimiento y celebra tus logros.</p>
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
                <div className="space-y-8 m-3">
                    
                    {/* Fila Superior: Rendimiento Diario (Ancho Completo) */}
                    <div className="w-full">
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