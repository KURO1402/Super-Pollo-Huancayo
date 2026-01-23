import API from "./axiosConfiguracion";

export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/auth/registro', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}

export const loginUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/auth/login', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}

export const generarCodigoVerificacion = async (correo) => {
    try {
        const respuesta = await API.post('auth/enviar-codigo-verificacion', { correo });
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}

export const validarCodigoVerificacion = async (codigo) => {
    try {
        const respuesta = await API.post('/auth/verificar-codigo', codigo);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
}