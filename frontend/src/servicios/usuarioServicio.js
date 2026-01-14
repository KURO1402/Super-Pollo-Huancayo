import API from "./axiosConfiguracion";

export const actualizarPerfilUsuarioServicio = async (idUsuario, datosActualizados) => {
  try {
    const respuesta = await API.put(`/usuarios/actualizar-usuario/${idUsuario}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerUsuarioActualServicio = async (idUsuario) => {
  try {
    const respuesta = await API.get(`/usuarios/${idUsuario}`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarCorreoUsuarioServicio = async (idUsuario, datos) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-correo/${idUsuario}`, datos);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar correo");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarClaveUsuarioServicio = async (idUsuario, datos) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-clave/${idUsuario}`, datos);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar contraseña");
    }
  } catch (error) {
    throw error;
  }
};