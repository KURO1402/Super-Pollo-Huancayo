import API from "./axiosConfiguracion";

export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/auth/registro', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
};

export const loginUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/auth/login', datos);
        return respuesta.data;
    } catch (error) {
        throw error;
    }
};

export const generarCodigoVerificacion = async (correo, tipoVerificacion = 1) => {
    const respuesta = await API.post('/auth/enviar-codigo-verificacion', { 
        correo, 
        tipoVerificacion: Number(tipoVerificacion)
    });
    return respuesta.data;
};

export const validarCodigoVerificacion = async (codigo) => {
    try {
        const respuesta = await API.post('/auth/verificar-codigo', {
            ...codigo,
            tipoVerificacion: Number(codigo.tipoVerificacion),
        });
        return respuesta.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUsuario = async () => {
    try {
        const respuesta = await API.post('/auth/logout');
        return respuesta.data;
    } catch (error) {
        throw error;
    }
};

export const restaurarClave = async (correoUsuario, nuevaClave) => {
    const respuesta = await API.post('/auth/restaurar-clave', { correoUsuario, nuevaClave });
    return respuesta.data;
}