import { useState, useEffect } from 'react';
import { Plus, Users, Shield, UserCheck, Loader2, X, Save, Mail } from 'lucide-react';

export default function Team() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'agent',
        is_active: true
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/users/');
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

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({ email: '', password: '', role: 'agent', is_active: true });
                fetchUsers();
            } else {
                const err = await response.json();
                alert('Error: ' + (err.detail || 'Fallo'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Equipo</h1>
                    <p className="text-gray-400 text-sm">Administra los usuarios y permisos de tu agencia</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                </button>
            </div>

            {loading ? (
                <div className="text-white text-center py-10">Cargando equipo...</div>
            ) : (
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                            <tr>
                                <th className="px-6 py-3">Usuario / Email</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-6">No hay usuarios registrados</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active ? (
                                                <span className="flex items-center text-green-400 text-xs">
                                                    <UserCheck className="w-3 h-3 mr-1" /> Activo
                                                </span>
                                            ) : (
                                                <span className="text-red-400 text-xs">Inactivo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{String(user.id).substring(0, 8)}...</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white">Nuevo Usuario</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="agente@empresa.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="******"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="agent">Agente</option>
                                    <option value="manager">Gerente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
