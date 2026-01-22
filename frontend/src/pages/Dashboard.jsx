import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_properties: 0,
        properties_for_sale: 0,
        properties_for_rent: 0,
        total_clients: 0,
        active_clients: 0,
        sales_count: 0,
        rented_count: 0
    });

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/dashboard/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const chartData = [
        {
            name: 'Ventas',
            Inventario: stats.properties_for_sale,
            Cerradas: stats.sales_count,
        },
        {
            name: 'Arriendos',
            Inventario: stats.properties_for_rent,
            Cerradas: stats.rented_count || 0,
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Propiedades Totales', value: stats.total_properties, change: 'Inventario Global', color: 'from-blue-500 to-blue-600' },
                    { title: 'En Venta', value: stats.properties_for_sale, change: 'Disponibles + Vendidas', color: 'from-green-500 to-green-600' },
                    { title: 'En Arriendo', value: stats.properties_for_rent, change: 'Disponibles + Rentadas', color: 'from-purple-500 to-purple-600' },
                    { title: 'Operaciones Exitosas', value: stats.sales_count + (stats.rented_count || 0), change: 'Total Cerradas', color: 'from-orange-500 to-orange-600' },
                ].map((stat, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                        <div className="mt-2 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            <span className="text-sm font-medium text-gray-400">
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${stat.color} w-full rounded-full opacity-80`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Rendimiento de Inventario</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Inventario" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total en Cartera" />
                                <Bar dataKey="Cerradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Operaciones Cerradas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Summary / Quick Actions placeholder or secondary chart */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                        <span className="text-4xl text-blue-500">
                            {stats.total_properties > 0
                                ? Math.round(((stats.sales_count + (stats.rented_count || 0)) / stats.total_properties) * 100)
                                : 0}%
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Tasa de Efectividad Global</h3>
                    <p className="text-gray-400 mt-2 max-w-xs">
                        Porcentaje de propiedades que se han vendido o arrendado respecto al total captado.
                    </p>
                </div>
            </div>
        </div>
    );
}
