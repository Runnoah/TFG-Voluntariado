import axiosInstance from './axiosInstance';

// Función para obtener todas las pedanías
export const getPedanias = async () => {
    try {
        const response = await axiosInstance.get('pedanias/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las pedanías:", error);
        throw error;
    }
};