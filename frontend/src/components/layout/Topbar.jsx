import { Bell, Search, User } from 'lucide-react';

export default function Topbar() {
    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border-none rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Luis Vahos</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        LV
                    </div>
                </div>
            </div>
        </header>
    );
}
