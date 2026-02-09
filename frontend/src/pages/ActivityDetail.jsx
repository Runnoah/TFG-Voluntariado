import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Button } from '../components/ui/Button';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function ActivityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth(); // Get user and token
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasJoined, setHasJoined] = useState(false);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axiosInstance.get(`anuncios/${id}/`);
                setActivity(response.data);

                // Check if user is already inscribed
                if (token) {
                    const inscripcionesParams = await axiosInstance.get('inscripciones/');
                    // Filter locally because the endpoint returns all for the user
                    const isJoined = inscripcionesParams.data.some(insc => insc.anuncio === parseInt(id));
                    setHasJoined(isJoined);
                }
            } catch (err) {
                console.error("Error fetching activity details:", err);
                setError("No se pudo cargar la actividad.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id, token]);

    const handleJoin = async () => {
        if (!token) return navigate('/login');
        setJoining(true);
        try {
            await axiosInstance.post('inscripciones/', {
                anuncio: id,
                estado: 'pendiente' // Default state
            });
            setHasJoined(true);
            // Optionally refresh activity to show updated spaces if backend handles it
            setActivity(prev => ({ ...prev, plazas_restantes: prev.plazas_restantes - 1 }));
        } catch (error) {
            console.error("Error joining activity", error);
            alert("Error al inscribirse. Inténtalo de nuevo.");
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-600"></div>
                </div>
            </Layout>
        );
    }

    if (error || !activity) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad no encontrada</h2>
                    <Button onClick={() => navigate(-1)} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver atrás
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Hero Image */}
                <div className="relative h-[50vh] w-full">
                    <img
                        src={activity.imagen || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt={activity.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                        <div className="max-w-5xl mx-auto">
                            <Button
                                onClick={() => navigate(-1)}
                                variant="ghost"
                                className="text-white/80 hover:text-white hover:bg-white/10 mb-6 p-0"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" /> Volver
                            </Button>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                    ${activity.estado === 'publicado' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>
                                    {activity.estado === 'publicado' ? 'Abierto' : 'Finalizado'}
                                </span>
                                <span className="text-gray-300 text-sm flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" /> {activity.nombre_pedania}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                                {activity.titulo}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre esta actividad</h2>
                                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                    {activity.descripcion}
                                </p>
                            </div>

                            {/* Additional Details (Example) */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">¿Qué necesitas saber?</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Lleva ropa cómoda y adecuada para el clima.</li>
                                    <li>Llega 15 minutos antes de la hora de inicio.</li>
                                    <li>¡Trae mucha energía y ganas de ayudar!</li>
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Detalles del Evento</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="bg-brand-50 p-2 rounded-lg mr-4">
                                            <Calendar className="h-6 w-6 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Fecha</p>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {new Date(activity.fecha_evento).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-brand-50 p-2 rounded-lg mr-4">
                                            <Clock className="h-6 w-6 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Hora</p>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {new Date(activity.fecha_evento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-brand-50 p-2 rounded-lg mr-4">
                                            <Users className="h-6 w-6 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Plazas</p>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {activity.plazas_restantes} disponibles
                                                <span className="text-sm text-gray-400 font-normal ml-1">
                                                    / {activity.cupo_maximo}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        {user ? (
                                            hasJoined ? (
                                                <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white cursor-default">
                                                    ¡Ya estás inscrito!
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleJoin}
                                                    disabled={joining || activity.plazas_restantes <= 0}
                                                    className={`w-full py-6 text-lg shadow-lg shadow-brand-500/30 ${activity.plazas_restantes <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {joining ? 'Inscribiendo...' : (activity.plazas_restantes > 0 ? 'Inscribirme Ahora' : 'Plazas Agotadas')}
                                                </Button>
                                            )
                                        ) : (
                                            <div className="text-center">
                                                <Button onClick={() => navigate('/login')} className="w-full py-6 text-lg mb-2">
                                                    Inicia Sesión para Inscribirte
                                                </Button>
                                                <p className="text-xs text-gray-400">
                                                    Es necesario tener cuenta para participar.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
