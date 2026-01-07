import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
})

export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/registrar', datos);
        return respuesta.data; 
    } catch (error) {
        throw error;
    }
}

export const loginUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/login', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}

export const generarCodigoVerificacion = async (correo) => {
    try {
        const respuesta = await API.post('/autenticacion/generar-codigo', { correo });
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}

export const validarCodigoVerificacion = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/validar-codigo', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}