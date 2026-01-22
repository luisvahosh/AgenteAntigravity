import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Home, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_revenue: 0,
        sales_count: 0,
        rentals_count: 0,
        recent_transactions: []
    });

    // Mock data for charts (until we have enough real history)
    const chartData = [
        { name: 'Ene', ventas: 4000, rentas: 2400 },
        { name: 'Feb', ventas: 3000, rentas: 1398 },
        { name: 'Mar', ventas: 2000, rentas: 9800 },
        { name: 'Abr', ventas: 2780, rentas: 3908 },
        { name: 'May', ventas: 1890, rentas: 4800 },
        { name: 'Jun', ventas: 2390, rentas: 3800 },
        { name: 'Jul', ventas: 3490, rentas: 4300 },
    ];

    const pieData = [
        { name: 'Ventas', value: 400 },
        { name: 'Rentas', value: 300 },
        { name: 'Disponibles', value: 300 },
    ];
    const COLORS = ['#3b82f6', '#10b981', '#6b7280'];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${endpoints.transactions}/summary`);
            if (response.ok) {
                const result = await response.json();
                // Merge real data with mock chart data if needed, or just use real summary metrics
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching report stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes Financieros</h1>
                    <p className="text-gray-400 text-sm">Resumen de transacciones y rendimiento</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option>Últimos 6 meses</option>
                        <option>Este año</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Ingresos Totales</p>
                            <h3 className="text-3xl font-bold text-white mt-1">${data.total_revenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span>12% vs mes anterior</span>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Propiedades Vendidas</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data.sales_count}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span>+2 esta semana</span>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Propiedades Rentadas</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data.rentals_count}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Home className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-400">
                        <span>Estable</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6">Tendencia de Ingresos</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVentas)" />
                                <Area type="monotone" dataKey="rentas" stroke="#10b981" fillOpacity={1} fill="url(#colorRentas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6">Distribución</h3>
                    <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-white">1000</span>
                                <p className="text-xs text-gray-500">Total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">Transacciones Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Monto</th>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center">No hay transacciones recientes</td>
                                </tr>
                            ) : (
                                data.recent_transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-gray-800">
                                        <td className="px-6 py-4 font-mono text-xs">{String(tx.id).substring(0, 8)}...</td>
                                        <td className="px-6 py-4 capitalize">{tx.type}</td>
                                        <td className="px-6 py-4 text-white font-medium">${tx.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">Completado</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
