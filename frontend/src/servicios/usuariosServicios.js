import API from './axiosConfiguracion';

export const obtenerUsuariosServicio = async ({ limite = 10, offset = 0, filtros = {}} = {}) => {
  try {
    const parametros = new URLSearchParams();

    parametros.append('limit', limite);
    parametros.append('offset', offset);

    if(filtros.busqueda)parametros.append('busqueda', filtros.busqueda);
    if(filtros.rol)parametros.append('rol', filtros.rol);

    const respuesta = await API.get(`/usuarios?${parametros.toString()}`);

    if (respuesta.data && respuesta.data.ok) {
      return {
        usuarios: respuesta.data.usuarios ?? [],
        total: respuesta.data.cantidad_filas ?? 0,
      }
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener usuarios');
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerRolesUsuariosServicio = async () => {
  try {
    const respuesta = await API.get('/usuarios/roles');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener roles de usuarios');
    }
  } catch (error) {
    throw error;
  }
}

export const actualizarRolUsuarioServicio = async (id_usuario, id_rol) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-rol/${id_usuario}`, {
      nuevoRol: id_rol
    });
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar rol del usuario");
    }
  } catch (error) {
    throw error;
  }
}

export const eliminarUsuarioServicio = async (id_usuario) => {
  try {
    const respuesta = await API.delete(`/usuarios/eliminar-usuario/${id_usuario}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al eliminar usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerUsuarioPorIdServicio = async () => {
  try {
    const respuesta = await API.get(`/usuarios/usuario`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuario");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarUsuarioServicio = async (idUsuario, datosActualizados) => {
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

export const actualizarCorreoUsuarioServicio = async (datos) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-correo`, datos);
    
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
    const respuesta = await API.patch(`/usuarios/actualizar-clave`, datos);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar contraseña");
    }
  } catch (error) {
    throw error;
  }
};