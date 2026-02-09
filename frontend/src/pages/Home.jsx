import React, { useEffect, useState, useRef } from 'react';
import Carousel from '../components/Carousel';
import Layout from '../layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Home() {
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const activitiesRef = useRef(null);

    useEffect(() => {
        // Fetch recent activities from API
        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get('anuncios/');
                // Take only the first 3 for the home page sections
                setRecentActivities(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const scrollToActivities = () => {
        if (activitiesRef.current) {
            // Scroll with a small offset for the navbar
            const y = activitiesRef.current.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <Layout>
            <Carousel onMoreClick={scrollToActivities} />

            <section ref={activitiesRef} className="py-20 bg-gray-50">
                <div className="w-full px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Actividades Recientes
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Descubre las últimas oportunidades para colaborar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            <p>Cargando actividades...</p>
                        ) : recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={activity.imagen || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} // Fallback image if null
                                            alt={activity.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.titulo}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{activity.descripcion}</p>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{new Date(activity.fecha_evento).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                                {activity.nombre_pedania}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500">
                                No hay actividades recientes para mostrar.
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/actividades">
                            <Button variant="outline" size="lg" className="inline-flex items-center">
                                Ver todas las actividades
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-indigo-700 py-16">
                <div className="w-full px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        ¿Listo para marcar la diferencia?
                    </h2>
                    <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
                        Únete a nuestra comunidad de voluntarios y ayuda a construir un futuro mejor para todos.
                    </p>
                    <div className="mt-8">
                        <Link to="/register">
                            <Button variant="secondary" size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                                Registrarse Ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
