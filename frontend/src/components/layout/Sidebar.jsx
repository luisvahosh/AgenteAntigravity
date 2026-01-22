import { Home, Users, Building2, BarChart3, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Propiedades', href: '/properties', icon: Building2 },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-900 text-white border-r border-gray-800">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Real Estate CRM
                </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
