import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, login, logout, token } = useAuth(); // Assuming 'token' indicates logged in state roughly
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
            <div className="w-full px-6">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-12">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="bg-gradient-to-br from-brand-500 to-accent-500 p-2 rounded-lg text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
                                    <HeartHandshake className="h-8 w-8" strokeWidth={2.5} />
                                </div>
                                <span className="text-3xl font-black bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
                                    VoluntadMazarrón
                                </span>
                            </Link>
                        </div>
                        <div className="hidden sm:flex sm:space-x-4">
                            <Link to="/">
                                <Button variant="ghost" className="text-base font-medium text-gray-600 hover:text-brand-600">
                                    Inicio
                                </Button>
                            </Link>
                            <Link to="/actividades">
                                <Button variant="ghost" className="text-base font-medium text-gray-600 hover:text-brand-600">
                                    Actividades
                                </Button>
                            </Link>
                            <Link to="/noticias">
                                <Button variant="ghost" className="text-base font-medium text-brand-600 hover:text-brand-700 bg-brand-50/50">
                                    Noticias
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {token && user ? (
                            <div className="flex items-center space-x-6">
                                <span className="text-sm font-medium text-gray-700">
                                    Hola, {user.first_name || user.username}
                                </span>
                                <Link to="/perfil">
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-600">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Mi Perfil
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Salir
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" className="font-medium">Iniciar Sesión</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="gradient" className="shadow-lg shadow-brand-500/20">
                                        Registrarse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                        >
                            <span className="sr-only">Abrir menú</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden bg-white border-t border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="bg-brand-50 border-brand-500 text-brand-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/actividades"
                            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Actividades
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-100">
                        {token ? (
                            <div className="flex items-center px-4">
                                <div className="ml-3 w-full">
                                    <div className="text-base font-medium text-gray-800 mb-2">Usuario</div>
                                    <Button variant="danger" onClick={handleLogout} className="w-full justify-center">
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-2 px-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                                    <Button variant="outline" className="w-full justify-center">Iniciar Sesión</Button>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block">
                                    <Button variant="gradient" className="w-full justify-center">Registrarse</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
