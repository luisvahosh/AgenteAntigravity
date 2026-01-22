import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
