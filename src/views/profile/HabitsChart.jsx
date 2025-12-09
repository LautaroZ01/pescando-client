import { useEffect, useState } from "react"
import { getGraphData } from "../../API/HabitAPI.js"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoIosStats } from "react-icons/io";

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

    if (loading) return (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );
    
    if (data.length === 0) return (
        <div className="text-center p-10 bg-orange-50/50 rounded-2xl border-2 border-dashed border-orange-200">
            <p className="text-gray-500">Aún no tienes hábitos para medir.</p>
        </div>
    );

    return (
        <div className="w-full h-[400px] bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-6">
                <IoIosStats className="h-8 w-8 text-orange-500"/>
                <h3 className="text-xl font-bold text-gray-800 relative group cursor-default">
                    Rendimiento de hoy
                    <span className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 'dataMax']} hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        tick={{fontSize: 12, fill: '#666'}} 
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        cursor={{fill: '#fff7ed'}} // Un naranja muy suave al pasar el mouse
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontFamily: 'MuseoModerno'
                        }}
                    />
                    <Bar 
                        dataKey="completadas" 
                        name="Tareas Completadas" 
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
        </div>
    );
}