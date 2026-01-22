import { useState, useEffect } from 'react';
import { endpoints } from '../../config/api';
import { User, Shield, Mail, Plus, Trash2, Key } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'agent',
        is_active: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(endpoints.users);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(endpoints.users, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert('Usuario creado correctamente');
                setShowForm(false);
                setNewUser({ email: '', password: '', role: 'agent', is_active: true });
                fetchUsers();
            } else {
                const text = await response.text();
                try {
                    const err = JSON.parse(text);
                    alert('Error del servidor: ' + (typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail)));
                } catch {
                    alert(`Error inesperado (${response.status}): ${text.substring(0, 100)}...`);
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Error de conexión o red: ' + error.message);
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 mt-8">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Usuarios y Permisos
                    </h2>
                    <p className="text-gray-400 text-sm">Gestiona el acceso al sistema</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {showForm ? 'Cancelar' : 'Nuevo Usuario'}
                </button>
            </div>

            {showForm && (
                <div className="p-6 bg-gray-800/30 border-b border-gray-800 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="usuario@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Contraseña</label>
                            <input
                                required
                                type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="******"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Rol</label>
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="admin">Administrador</option>
                                <option value="agent">Agente Inmobiliario</option>
                            </select>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Crear Usuario
                        </button>
                    </form>
                </div>
            )}

            <div className="p-0">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-900/50 border-b border-gray-800">
                        <tr>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Cargando...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-4">No hay usuarios registrados.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-medium text-white flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mr-3">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs capitalize ${user.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700/50 text-gray-300'
                                            }`}>
                                            {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <Key className="w-3 h-3 mr-1" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
