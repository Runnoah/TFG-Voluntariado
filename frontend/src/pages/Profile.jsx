import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Calendar, MapPin, Phone, Briefcase, Camera, X, Edit2 } from 'lucide-react';

export default function Profile() {
    const { user, token } = useAuth();
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        const fetchInscriptions = async () => {
            if (token) {
                try {
                    const response = await axiosInstance.get('inscripciones/');
                    setInscriptions(response.data);
                } catch (error) {
                    console.error("Error al cargar inscripciones", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInscriptions();
    }, [token]);

    // Initialize form data when user loads or edit starts
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                telefono: user.telefono || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                nombre_entidad: user.nombre_entidad || '',
                // Foto is handled separately due to file input
            });
        }
    }, [user, isEditing]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        try {
            await axiosInstance.put('me/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Error al actualizar el perfil.");
        } finally {
            setSaveLoading(false);
            setIsEditing(false);
        }
    };

    if (!user) return <Layout><div>Cargando perfil...</div></Layout>;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 relative group">
                    <div className="bg-gradient-to-r from-brand-600 to-accent-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                                    {user.foto ? (
                                        <img src={user.foto} alt="Perfil" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                            <User className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-4 w-4 mr-2" /> Editar Perfil
                            </Button>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.first_name} {user.last_name}</h1>
                            <p className="text-gray-500">@{user.username || 'usuario'} • {user.rol || 'Voluntario'}</p>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" /> {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" /> {user.telefono || 'Sin teléfono'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" /> {user.fecha_nacimiento || 'Sin fecha nacimiento'}
                                </div>
                                {user.rol === 'organizacion' && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-gray-400" /> {user.nombre_entidad || 'Sin entidad'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Editar Perfil</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="relative h-24 w-24">
                                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                user.foto ? <img src={user.foto} className="h-full w-full object-cover" /> : <div className="bg-gray-100 h-full w-full flex items-center justify-center"><User /></div>
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-brand-700 shadow-sm">
                                            <Camera className="h-4 w-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nombre" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                                    <Input label="Apellidos" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                                </div>
                                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                                <Input label="Fecha Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />

                                {user.rol === 'organizacion' && (
                                    <Input label="Nombre Entidad" name="nombre_entidad" value={formData.nombre_entidad} onChange={handleInputChange} />
                                )}

                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                    <Button type="submit" className="flex-1" disabled={saveLoading}>
                                        {saveLoading ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Inscripciones</h2>

                {loading ? (
                    <div className="text-center py-10">Cargando actividades...</div>
                ) : inscriptions.length > 0 ? (
                    <div className="grid gap-6">
                        {inscriptions.map((inscription) => (
                            <div key={inscription.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-center group hover:shadow-lg transition-shadow">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {inscription.titulo_anuncio || `Actividad #${inscription.anuncio}`}
                                    </h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Fecha: {new Date(inscription.fecha_inscripcion).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${inscription.estado === 'confirmada' ? 'bg-green-100 text-green-700' :
                                    inscription.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {inscription.estado || 'Inscrito'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">No te has inscrito a ninguna actividad aún.</p>
                        <Button variant="gradient" onClick={() => window.location.href = '/actividades'}>
                            Explorar Actividades
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
