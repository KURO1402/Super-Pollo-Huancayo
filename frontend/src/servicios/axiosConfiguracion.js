import axios from 'axios';
import { useAutenticacionStore } from '../store/useAutenticacionStore';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    let accessToken = null;

    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        accessToken = parsed.state.accessToken;
      } catch (error) {}
    }
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── Renovar token ──────────────────────────────────────────────────────
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/renovar-token') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await API.post('/auth/renovar-token');
        const nuevoAccessToken = refreshResponse.data.accessToken;
        useAutenticacionStore.getState().setAccessToken(nuevoAccessToken);
        originalRequest.headers.Authorization = `Bearer ${nuevoAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        useAutenticacionStore.getState().logout();
        window.location.href = '/inicio-sesion';
        return Promise.reject(refreshError);
      }
    }

    // ── Extraer mensaje: si data es Blob, parsearlo primero ────────────────
    let mensaje = "Error interno del servidor";
    const data = error.response?.data;

    if (data instanceof Blob && data.type === 'application/json') {
      try {
        const texto = await data.text();
        const json = JSON.parse(texto);
        mensaje = json.mensaje || json.message || mensaje;
      } catch (_) {}
    } else if (data) {
      mensaje = data.mensaje || data.message || mensaje;
    }

    const errorPersonalizado = new Error(mensaje);
    errorPersonalizado.status = status;
    errorPersonalizado.data = data;
    return Promise.reject(errorPersonalizado);
  }
);

export default API;