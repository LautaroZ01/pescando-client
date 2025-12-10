import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FaChartLine } from "react-icons/fa";
import ChartCard from '../../components/ChartCard';

export default function WeeklyProgressChart({ data, loading, subtitle }) {
    return (
        <ChartCard
            title="Progreso Semanal"
            subtitle={subtitle}
            icon={<FaChartLine />}
            isLoading={loading}
            isEmpty={!data || data.length === 0}
            emptyMessage="Completa hábitos para ver tu línea de progreso"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                        dy={10}
                    />
                    
                    {/* Eje Y oculto para limpieza visual, o puedes activarlo quitando 'hide' */}
                    <YAxis hide domain={[0, 'auto']} />
                    
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontFamily: 'inherit'
                        }}
                    />
                    
                    {/* Línea de Meta */}
                    <Line 
                        type="monotone" 
                        dataKey="meta" 
                        name="Total de Hábitos"
                        stroke="#F59E0B" 
                        strokeDasharray="5 5" 
                        dot={false} 
                        strokeWidth={2}
                    />

                    {/* Línea de Completados (Rosa Curva) */}
                    <Line 
                        type="monotone" 
                        dataKey="completados" 
                        name="Completados"
                        stroke="#EC4899" 
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#EC4899', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}