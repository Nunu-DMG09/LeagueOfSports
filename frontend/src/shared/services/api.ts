import axios from 'axios';

// Creamos una instancia de Axios centralizada
export const api = axios.create({
  baseURL: 'http://localhost:4000/api', // La URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});