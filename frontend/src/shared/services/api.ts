
import axios from 'axios';

// Backend según el entorno
const API_URL = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:4000'
).replace(/\/$/, '');

// Instancia centralizada de Axios
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inyectar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
