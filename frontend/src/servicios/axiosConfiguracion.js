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
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/renovar-token')
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

    return Promise.reject(error);
  }
);

export default API;