import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="w-full py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-black bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent uppercase tracking-wider">VoluntadMazarrón</h3>
                        <p className="mt-4 text-base text-gray-500">
                            Conectando personas con causas que importan. Únete a nosotros para hacer una diferencia en tu comunidad hoy mismo.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navegación</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="/" className="text-base text-gray-500 hover:text-brand-600 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/actividades" className="text-base text-gray-500 hover:text-brand-600 transition-colors">
                                    Actividades
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-base text-gray-500 hover:text-brand-600 transition-colors">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contacto</h3>
                        <ul className="mt-4 space-y-4">
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-base text-gray-500">contacto@voluntariado.com</span>
                            </li>
                            <li className="flex space-x-6 mt-4">
                                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <Facebook className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <Twitter className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-8 text-center">
                    <p className="text-base text-gray-400">&copy; 2026 Plataforma de Voluntariado. Hecho por Estefania y Ruben. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
