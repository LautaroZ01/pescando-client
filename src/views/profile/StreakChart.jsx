import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { GiTrophyCup } from "react-icons/gi"
import ChartCard from "../../components/ChartCard";
import { getStreaksData } from "../../API/HabitAPI";

export default function StreakChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getStreaksData();
                setData(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <ChartCard
            title="Mejores Rachas"
            subtitle="Tus hábitos más constantes"
            icon={<GiTrophyCup />}
            isLoading={loading}
            isEmpty={data.length === 0}
            emptyMessage="Completa tareas consecutivas para aparecer en el podio"
            height="h-[350px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    layout="vertical" 
                    margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120} 
                        tick={{ fontSize: 13, fill: '#555', fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                        formatter={(value) => [`${value} días`, 'Racha']}
                    />
                    <Bar 
                        dataKey="streak" 
                        radius={[0, 6, 6, 0]} 
                        barSize={24} 
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            // El primero (Top 1) será Dorado/Ámbar, el resto Naranja
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : '#FB923C'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}