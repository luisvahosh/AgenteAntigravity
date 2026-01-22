import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';
import { Plus, Search, Building2, MapPin, Bed, Bath, LayoutGrid, Filter } from 'lucide-react';
import PropertyForm from '../components/properties/PropertyForm';
import PropertyDetails from '../components/properties/PropertyDetails';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null); // For details modal

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch properties from API
    const fetchProperties = async () => {
        try {
            const response = await fetch(endpoints.properties);
            if (response.ok) {
                const data = await response.json();
                setProperties(data);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Filter Logic
    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            property.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Helper for Status Badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'sold':
                return <span className="absolute top-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">VENDIDA</span>;
            case 'rented':
                return <span className="absolute top-3 left-3 bg-blue-500/90 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">ARRENDADA</span>;
            default:
                return <span className="absolute top-3 left-3 bg-green-500/90 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">DISPONIBLE</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Propiedades</h1>
                    <p className="text-gray-400 text-sm">Gestiona tu inventario inmobiliario</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Propiedad
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por Zona, Dirección o Título..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                        <option value="all">Todas las propiedades</option>
                        <option value="available">Disponibles</option>
                        <option value="sold">Vendidas</option>
                        <option value="rented">Arrendadas</option>
                    </select>
                </div>
            </div>

            {/* Grid View */}
            {loading ? (
                <div className="text-white text-center py-10">Cargando propiedades...</div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-gray-400 text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron propiedades con estos filtros.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <div key={property.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors group relative">
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700 group-hover:scale-105 transition-transform duration-500">
                                    <LayoutGrid className="w-12 h-12" />
                                </div>

                                {/* Status Badge */}
                                {getStatusBadge(property.status)}

                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded border border-white/10">
                                    {property.type === 'sale' ? 'Venta' : 'Arriendo'}
                                </div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <span className="text-xl font-bold text-white drop-shadow-md">
                                        ${property.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1 truncate" title={property.title}>{property.title}</h3>
                                <div className="flex items-center text-gray-400 text-sm mb-4">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{property.address}</span>
                                </div>

                                {/* Owner Info (if available) - Optional display */}
                                {property.owner_id && (
                                    <div className="mb-3 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded w-fit">
                                        Propiedad de Cliente Asociado
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-800 mb-4">
                                    <div className="flex flex-col items-center">
                                        <span className="flex items-center text-gray-300 text-sm font-bold">
                                            <Bed className="w-4 h-4 mr-1 text-blue-500" /> {property.bedrooms}
                                        </span>
                                        <span className="text-xs text-gray-500">Habs</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-gray-800">
                                        <span className="flex items-center text-gray-300 text-sm font-bold">
                                            <Bath className="w-4 h-4 mr-1 text-blue-500" /> {property.bathrooms}
                                        </span>
                                        <span className="text-xs text-gray-500">Baños</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-gray-800">
                                        <span className="flex items-center text-gray-300 text-sm font-bold">
                                            <LayoutGrid className="w-4 h-4 mr-1 text-blue-500" /> {property.area_sqm}
                                        </span>
                                        <span className="text-xs text-gray-500">m²</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProperty(property)}
                                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-blue-400 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <PropertyForm onClose={() => setShowForm(false)} onSuccess={fetchProperties} />
            )}

            {selectedProperty && (
                <PropertyDetails
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                />
            )}
        </div>
    );
}
