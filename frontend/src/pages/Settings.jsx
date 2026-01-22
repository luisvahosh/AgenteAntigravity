import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';
import { Save, Building, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import UserManagement from '../components/settings/UserManagement';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tenant, setTenant] = useState({
        name: '',
        subdomain: '',
        subscription_plan: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${endpoints.tenants}/me`);
            if (response.ok) {
                const data = await response.json();
                setTenant(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setTenant({ ...tenant, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(`${endpoints.tenants}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: tenant.name,
                    subdomain: tenant.subdomain
                }),
            });

            if (response.ok) {
                alert('Configuración guardada correctamente');
            } else {
                alert('Error al guardar');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-6">Cargando configuración...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-white">Configuración</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-600/20 rounded-lg">
                                <Building className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Perfil de Agencia</h2>
                                <p className="text-gray-400 text-sm">Información pública de tu empresa</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Agencia</label>
                                <input
                                    required
                                    name="name"
                                    value={tenant.name}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Subdominio / URL</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-gray-400 text-sm">
                                        https://
                                    </span>
                                    <input
                                        required
                                        name="subdomain"
                                        value={tenant.subdomain}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-r-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-700 bg-gray-800 text-gray-400 text-sm">
                                        .cr min.com
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Plan Card */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold text-white">Tu Plan</h3>
                        </div>

                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-purple-400 font-bold uppercase text-sm tracking-wider">
                                    {tenant.subscription_plan}
                                </span>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">Activo</span>
                            </div>
                            <p className="text-white text-2xl font-bold">$29<span className="text-sm text-gray-400 font-normal">/mes</span></p>
                        </div>

                        <ul className="space-y-2 text-sm text-gray-400 mb-6">
                            <li className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Propiedades Ilimitadas</li>
                            <li className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> CRM Completo</li>
                            <li className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Reportes Avanzados</li>
                        </ul>

                        <button className="w-full py-2 border border-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm">
                            Gestionar Suscripción
                        </button>
                    </div>
                </div>

            </div>

            <UserManagement />
        </div>
    );
}
