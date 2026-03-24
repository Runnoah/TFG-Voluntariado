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

    // Variables de estado para gestionar las actividades de la organización
    const [myActivities, setMyActivities] = useState([]);
    const [pedanias, setPedanias] = useState([]);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [activityForm, setActivityForm] = useState({
        titulo: '', descripcion: '', fecha_evento: '', etiqueta: 'otros', estado: 'borrador', cupo_maximo: 0, pedanias: ''
    });
    const [activityImage, setActivityImage] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);


    // Variables de estado para el formulario de edición del perfil
    const [formData, setFormData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        const fetchInscriptions = async () => {
            if (token) {
                try {
                    const response = await axiosInstance.get('inscripciones/');
                    setInscriptions(response.data);
                    
                    if (user && user.rol === 'organizacion') {
                        const [anunciosRes, pedaniasRes] = await Promise.all([
                            axiosInstance.get('anuncios/'),
                            axiosInstance.get('pedanias/')
                        ]);
                        // Filtramos las actividades para mostrar solo las que ha creado esta organización (comparando el ID del usuario)
                        const myActs = anunciosRes.data.filter(a => a.usuario === user.id);
                        setMyActivities(myActs);
                        setPedanias(pedaniasRes.data);
                    }
                } catch (error) {
                    console.error("Error al cargar datos", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        if (user) {
            fetchInscriptions();
        }
    }, [token, user]);

    // Inicializamos el formulario con los datos del usuario en cuanto cargue o cuando empiece a editar
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                telefono: user.telefono || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                nombre_entidad: user.nombre_entidad || '',
                // La foto de perfil se gestiona por separado al ser un archivo
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

    const handleActivityInputChange = (e) => {
        setActivityForm({ ...activityForm, [e.target.name]: e.target.value });
    };

    const handleActivityImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setActivityImage(file);
    };

    const openCreateActivityModal = () => {
        setEditingActivity(null);
        setActivityForm({ titulo: '', descripcion: '', fecha_evento: '', etiqueta: 'otros', estado: 'borrador', cupo_maximo: 0, pedanias: pedanias[0]?.id || '' });
        setActivityImage(null);
        setIsActivityModalOpen(true);
    };

    const openEditActivityModal = (activity) => {
        setEditingActivity(activity);
        // Formateamos la fecha al estilo YYYY-MM-DDTHH:MM para que el input de tipo datetime-local la pueda leer
        let formattedDate = '';
        if (activity.fecha_evento) {
            const dateObj = new Date(activity.fecha_evento);
            formattedDate = dateObj.toISOString().slice(0, 16);
        }
        setActivityForm({
            titulo: activity.titulo,
            descripcion: activity.descripcion,
            fecha_evento: formattedDate,
            etiqueta: activity.etiqueta,
            estado: activity.estado,
            cupo_maximo: activity.cupo_maximo,
            pedanias: activity.pedanias
        });
        setActivityImage(null);
        setIsActivityModalOpen(true);
    };

    const handleSaveActivity = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(activityForm).forEach(key => data.append(key, activityForm[key]));
        if (activityImage) data.append('imagen', activityImage);

        try {
            if (editingActivity) {
                await axiosInstance.put(`anuncios/${editingActivity.id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await axiosInstance.post('anuncios/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setIsActivityModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error saving activity", error);
            alert("Error al guardar la actividad.");
        }
    };

    const handleDeleteActivity = (activity) => {
        setActivityToDelete(activity);
    };

    const confirmDeleteActivity = async () => {
        if (!activityToDelete) return;
        try {
            await axiosInstance.delete(`anuncios/${activityToDelete.id}/`);
            setMyActivities(myActivities.filter(a => a.id !== activityToDelete.id));
            setActivityToDelete(null);
        } catch (error) {
            console.error("Error deleting activity", error);
            alert("Error al eliminar la actividad.");
            setActivityToDelete(null);
        }
    };

    if (!user) return <Layout><div>Cargando perfil...</div></Layout>;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Cabecera principal del perfil del usuario */}
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

                {/* Modal emergente para editar los datos personales del Perfil */}
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

                {/* Sección Exclusiva: Gestión de Actividades Creadas (Solo Organizaciones) */}
                {user.rol === 'organizacion' && (
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Mis Actividades Creadas</h2>
                            <Button className="bg-brand-600 hover:bg-brand-700" onClick={openCreateActivityModal}>
                                + Crear Actividad
                            </Button>
                        </div>

                        {myActivities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myActivities.map(activity => (
                                    <div key={activity.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                                        <div className="h-40 overflow-hidden relative">
                                            <img src={activity.imagen || "https://via.placeholder.com/400x200?text=No+Image"} alt={activity.titulo} className="w-full h-full object-cover" />
                                            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white ${activity.estado === 'publicado' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                {activity.estado}
                                            </div>
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col">
                                            <h3 className="font-bold text-lg mb-2">{activity.titulo}</h3>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{activity.descripcion}</p>
                                            <div className="flex gap-2 mt-auto">
                                                <Button variant="outline" className="flex-1 py-1" onClick={() => openEditActivityModal(activity)}>Editar</Button>
                                                <Button variant="outline" className="flex-1 py-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteActivity(activity)}>Borrar</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No has creado ninguna actividad aún.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal emergente para Crear o Editar una Actividad */}
                {isActivityModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h3 className="text-xl font-bold">{editingActivity ? 'Editar Actividad' : 'Crear Actividad'}</h3>
                                <button onClick={() => setIsActivityModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveActivity} className="p-6 space-y-4">
                                <Input label="Título" name="titulo" value={activityForm.titulo} onChange={handleActivityInputChange} required />
                                
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea name="descripcion" value={activityForm.descripcion} onChange={handleActivityInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500" rows="3" required></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Fecha del Evento" name="fecha_evento" type="datetime-local" value={activityForm.fecha_evento} onChange={handleActivityInputChange} required />
                                    <Input label="Cupo Máximo" name="cupo_maximo" type="number" min="0" value={activityForm.cupo_maximo} onChange={handleActivityInputChange} required />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Estado</label>
                                        <select name="estado" value={activityForm.estado} onChange={handleActivityInputChange} className="w-full border-gray-300 rounded-md shadow-sm">
                                            <option value="borrador">Borrador</option>
                                            <option value="publicado">Publicado</option>
                                            <option value="finalizado">Finalizado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Etiqueta</label>
                                        <select name="etiqueta" value={activityForm.etiqueta} onChange={handleActivityInputChange} className="w-full border-gray-300 rounded-md shadow-sm">
                                            <option value="medio_ambiente">Medio Ambiente</option>
                                            <option value="educacion">Educación</option>
                                            <option value="salud">Salud</option>
                                            <option value="comunidad">Comunidad</option>
                                            <option value="animales">Animales</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Pedanía</label>
                                        <select name="pedanias" value={activityForm.pedanias} onChange={handleActivityInputChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                                            <option value="">Selecciona...</option>
                                            {pedanias.map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Imagen</label>
                                    <input type="file" accept="image/*" onChange={handleActivityImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsActivityModalOpen(false)}>Cancelar</Button>
                                    <Button type="submit" className="flex-1">Guardar</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Advertencia para la Eliminación de una Actividad */}
                {activityToDelete && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <X className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Eliminar actividad?</h3>
                            <p className="text-gray-500 mb-8">
                                Estás a punto de borrar definitivamente la actividad <strong>"{activityToDelete.titulo}"</strong>. 
                                Esta acción no se puede deshacer y eliminará las inscripciones vinculadas. ¿Estás seguro?
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1" onClick={() => setActivityToDelete(null)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteActivity}>
                                    Sí, eliminar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
