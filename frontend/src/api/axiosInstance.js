import axios from 'axios';

const axiosInstance = axios.create({
    // La URL base de tu API de Django
    baseURL: 'http://127.0.0.1:8000/api/', 
    timeout: 5000, // Tiempo máximo de espera (5 segundos)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default axiosInstance;