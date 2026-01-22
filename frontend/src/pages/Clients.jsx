import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';
import { Plus, Search, User, Phone, Mail, FileText } from 'lucide-react';
import ClientForm from '../components/clients/ClientForm';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Fetch clients from API
    const fetchClients = async () => {
        try {
            const response = await fetch(endpoints.clients);
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clientes</h1>
                    <p className="text-gray-400 text-sm">Gestiona tus contactos y prospectos</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="text-white text-center py-10">Cargando clientes...</div>
                ) : clients.length === 0 ? (
                    <div className="text-gray-400 text-center py-20">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay clientes registrados.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Contacto</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Notas</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> {client.email}
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Phone className="w-3 h-3" /> {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${client.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                                {client.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-xs">{client.notes || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-400 hover:text-white transition-colors">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showForm && (
                <ClientForm onClose={() => setShowForm(false)} onSuccess={fetchClients} />
            )}
        </div>
    );
}
