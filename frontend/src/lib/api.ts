import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  withCredentials: true, // ✅ envia e recebe cookies httpOnly automaticamente
});

// Injeta o token JWT no header (fallback enquanto migração para cookie está em curso)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;