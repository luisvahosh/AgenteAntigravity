import { useState, useEffect } from 'react';
import { endpoints } from '../../config/api';
import { X, Save, Loader2 } from 'lucide-react';

export default function PropertyForm({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        area_sqm: '',
        type: 'sale',
        owner_id: '' // New field
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

        // Filter out empty owner_id if not selected (to send null) but backend expects Optional[UUID]
        // If empty string, send null or omit
        const payload = {
            ...formData,
            owner_id: formData.owner_id ? formData.owner_id : null
        };

        try {
            const response = await fetch(endpoints.properties, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.detail || 'No se pudo guardar'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                    <h2 className="text-xl font-bold text-white">Nueva Propiedad</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Owner Selection */}
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-1">Propietario / Cliente</label>
                        <select
                            name="owner_id"
                            value={formData.owner_id}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">-- Seleccionar Propietario --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej. Casa de Lujo en el Poblado"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Dirección</label>
                            <input
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Calle 10 # 30..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    required
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="sale">Venta</option>
                                <option value="rent">Arriendo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Habitaciones</label>
                            <input
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                type="number"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Baños</label>
                            <input
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                type="number"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Área (m²)</label>
                            <input
                                name="area_sqm"
                                value={formData.area_sqm}
                                onChange={handleChange}
                                type="number"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="120"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Detalles adicionales..."
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
                            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Propiedad
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
