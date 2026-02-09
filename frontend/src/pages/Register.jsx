import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/');
            } else {
                // Handle dict of errors or string
                if (typeof result.error === 'object') {
                    const firstMsg = Object.values(result.error).flat()[0];
                    setError(firstMsg || 'Error en el registro');
                } else {
                    setError(result.error || 'Error al registrarse.');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor. Asegúrate de que el backend está funcionando.');
        }
    };

    return (
        <Layout>
            <div
                className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://www.guiarepsol.com/content/dam/repsol-guia/contenidos-imagenes/viajar/vamos-de-excursion/mazarron-region-murcia-que-ver-hacer/gr-cms-media-featured_images-none-67048cbf-f294-4cb0-9549-f5784b87e624-11-cala-bahia-2.jpg')`
                }}
            >
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Crea tu cuenta
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Únete a nuestra comunidad de voluntarios
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    name="first_name"
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Apellidos"
                                    name="last_name"
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <Input
                                label="Usuario"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Input
                                label="Contraseña"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button type="submit" className="w-full" size="lg">
                                Registrarse
                            </Button>
                        </div>

                        <p className="mt-2 text-center text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
