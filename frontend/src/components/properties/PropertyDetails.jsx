import { useState } from 'react';
import { X, MapPin, Bed, Bath, LayoutGrid, User, Calendar, DollarSign, Home, CheckCircle } from 'lucide-react';
import TransactionForm from '../transactions/TransactionForm';

export default function PropertyDetails({ property, onClose }) {
    const [showTransactionForm, setShowTransactionForm] = useState(false);

    if (!property) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="relative h-64 bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        <Home className="w-24 h-24 opacity-20" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 to-transparent">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${property.status === 'available' ? 'bg-green-500/20 text-green-400' :
                                    property.status === 'sold' ? 'bg-red-500/20 text-red-400' :
                                        'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {property.status === 'available' ? 'DISPONIBLE' :
                                        property.status === 'sold' ? 'VENDIDA' : 'ARRENDADA'}
                                </span>
                                <h2 className="text-3xl font-bold text-white mb-1">{property.title}</h2>
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                                    {property.address}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Precio</div>
                                <div className="text-3xl font-bold text-white">{formatCurrency(property.price)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-800">
                        <div className="flex flex-col items-center justify-center p-2 text-center">
                            <div className="flex items-center text-blue-400 mb-1">
                                <Bed className="w-6 h-6 mr-2" />
                                <span className="text-2xl font-bold text-white">{property.bedrooms}</span>
                            </div>
                            <span className="text-sm text-gray-400">Habitaciones</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 text-center border-l border-gray-700">
                            <div className="flex items-center text-blue-400 mb-1">
                                <Bath className="w-6 h-6 mr-2" />
                                <span className="text-2xl font-bold text-white">{property.bathrooms}</span>
                            </div>
                            <span className="text-sm text-gray-400">Baños</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 text-center border-l border-gray-700">
                            <div className="flex items-center text-blue-400 mb-1">
                                <LayoutGrid className="w-6 h-6 mr-2" />
                                <span className="text-2xl font-bold text-white">{property.area_sqm}</span>
                            </div>
                            <span className="text-sm text-gray-400">Metros Cuadrados</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-400" />
                            Descripción
                        </h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-line bg-gray-800/30 p-4 rounded-xl">
                            {property.description || "No hay descripción disponible para esta propiedad."}
                        </p>
                    </div>

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                                Detalles Financieros
                            </h3>
                            <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Tipo de Operación</span>
                                    <span className="text-white font-medium capitalise">
                                        {property.type === 'sale' ? 'Venta' : 'Arriendo'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Precio</span>
                                    <span className="text-white font-medium">{formatCurrency(property.price)}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-400">Estado Actual</span>
                                    <span className="text-white font-medium capitalise">{property.status}</span>
                                </div>

                                {property.status === 'available' && (
                                    <button
                                        onClick={() => setShowTransactionForm(true)}
                                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-colors shadow-lg shadow-green-900/20 cursor-pointer flex items-center justify-center"
                                    >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Registrar Operación (Cerrar Negocio)
                                    </button>
                                )}
                            </div>
                        </div>

                        {property.owner_id && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-400" />
                                    Propietario / Cliente
                                </h3>
                                <div className="bg-gray-800/30 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-400 font-bold uppercase mb-1">Cliente Asociado</div>
                                        <div className="text-white font-medium">ID: {property.owner_id}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Consultar sección de clientes para más datos.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center text-xs text-gray-600 pt-4 border-t border-gray-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Registrada el: {formatDate(new Date().toISOString())} {/* Placeholder for created_at if not available */}
                        <span className="mx-2">•</span>
                        ID Propiedad: {property.id}
                    </div>
                </div>
            </div>

            {showTransactionForm && (
                <TransactionForm
                    property={property}
                    onClose={() => setShowTransactionForm(false)}
                    onSuccess={() => {
                        setShowTransactionForm(false);
                        onClose(); // Close details modal to refresh parent list
                    }}
                />
            )}
        </div>
    );
}

// Helper icon
function FileText({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    );
}
