import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getCategoryDistribution } from "../../API/HabitAPI"
import { FaChartPie } from "react-icons/fa"
import ChartCard from "../../components/ChartCard"

export default function CategoryPieChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async() => {
            try {
                const result = await getCategoryDistribution()
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
            title="Distribución por categoría"
            subtitle="Tus áreas de enfoque"
            icon={<FaChartPie />}
            isLoading={loading}
            isEmpty={data.length === 0}
            emptyMessage="Crea hábitos con categorías para ver tu distribución"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.fill} 
                                stroke="none" 
                            />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }} 
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}