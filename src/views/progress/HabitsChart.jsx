import { useEffect, useState } from "react"
import { getGraphData } from "../../API/HabitAPI.js"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoIosStats } from "react-icons/io";
import ChartCard from "../../components/ChartCard.jsx";

export default function HabitsCharts() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const graphData = await getGraphData()
                setData(graphData)
            } catch (error) {
                console.error("Error cargando gráficas:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <ChartCard
            title="Rendimiento de hoy"
            subtitle="Tasa de cumplimiento por hábito"
            icon={<IoIosStats />}
            isLoading={loading}
            isEmpty={data.length === 0}
            emptyMessage="No tienes hábitos activos hoy"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#fff7ed' }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontFamily: 'inherit'
                        }}
                        formatter={(value) => [`${value}%`, 'Completado']}
                    />
                    <Bar
                        dataKey="porcentaje" 
                        name="Progreso"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}