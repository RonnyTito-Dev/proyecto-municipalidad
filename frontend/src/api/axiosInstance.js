// api/axiosInstance.js

// Importamos axios
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Para enviar cookie httpOnly
});

// Exportar la api
export default api;