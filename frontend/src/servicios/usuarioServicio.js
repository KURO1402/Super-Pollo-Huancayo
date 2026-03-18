import API from "./axiosConfiguracion";

export const actualizarPerfilUsuarioServicio = async ( datosActualizados) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-usuario`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerUsuarioActualServicio = async () => {
  try {
    const respuesta = await API.get('/usuarios/usuario');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarCorreoUsuarioServicio = async (datos) => {
  try {
    const respuesta = await API.patch('/usuarios/actualizar-correo', datos);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar correo");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarClaveUsuarioServicio = async (datos) => {
  try {
    const respuesta = await API.patch('/usuarios/actualizar-clave', datos);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar contraseña");
    }
  } catch (error) {
    throw error;
  }
};