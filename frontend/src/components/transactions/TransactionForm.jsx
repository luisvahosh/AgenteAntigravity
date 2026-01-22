import { useState, useEffect } from 'react';
import { endpoints } from '../../config/api';
import { X, Save, Loader2, DollarSign, User } from 'lucide-react';

export default function TransactionForm({ property, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        property_id: property.id,
        client_id: '',
        type: property.type, // Default to property type
        amount: property.price,
        notes: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch(endpoints.clients);
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(endpoints.transactions, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('¡Operación registrada con éxito! Los reportes se actualizarán.');
                onSuccess(); // Refresh parent
                onClose();
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.detail || 'No se pudo registrar la transacción'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <DollarSign className="w-6 h-6 mr-2 text-green-500" />
                        Registrar {formData.type === 'sale' ? 'Venta' : 'Alquiler'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg text-blue-300 text-sm mb-4">
                        Registrando operación para: <strong>{property.title}</strong>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Cliente (Comprador/Inquilino)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                required
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                            >
                                <option value="">-- Seleccionar Cliente --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name} - {client.email}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monto Final ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                required
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                type="number"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Notas / Detalles</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Detalles del cierre, forma de pago..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Confirmar Operación
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
