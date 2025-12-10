import { useEffect, useState } from "react"
import ChartCard from "../../components/ChartCard"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { BiRadar } from "react-icons/bi"
import {  getCategoryPerformance } from "../../API/HabitAPI"

export default function PerformanceRadar() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const loadData = async() => {
            try {
                const result = await getCategoryPerformance()
                setData(result)
            } catch (error) {
                console.error("Error cargando categorías:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

return (
        <ChartCard
            title="Equilibrio"
            subtitle="Efectividad % por área"
            icon={<BiRadar />}
            isLoading={loading}
            isEmpty={data.length === 0}
            emptyMessage="Completa tareas para ver tu balance"
            height="h-[400px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} 
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false} 
                        axisLine={false} 
                    />
                    <Radar
                        name="Efectividad"
                        dataKey="A"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="#8B5CF6"
                        fillOpacity={0.4}
                    />
                    <Tooltip 
                        formatter={(value) => [`${value}%`, 'Efectividad']}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}