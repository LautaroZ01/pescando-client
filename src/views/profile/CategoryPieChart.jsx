import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getCategoryDistribution } from "../../API/HabitAPI"
import { FaChartPie } from "react-icons/fa"

export default function CategoryPieChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async() => {
            try {
                const result = await getCategoryDistribution()
                setData(result)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
    )

    if (data.length === 0) return (
        <div className="text-center p-10 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200 h-64 flex flex-col justify-center items-center">
            <p className="text-gray-500">No hay datos de categorías aún.</p>
        </div>
    )

    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 mb-6">
                <FaChartPie className="h-6 w-6 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-800 relative group cursor-default">
                    Distribución por Categoría
                    <span className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-purple-400 to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </h3>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // Esto lo hace tipo "Dona"
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
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
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}