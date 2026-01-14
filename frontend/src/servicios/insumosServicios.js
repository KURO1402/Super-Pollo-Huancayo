import API from "./axiosConfiguracion";

export const crearInsumoServicio = async (data) => {
  try {
    const respuesta = await API.post('/insumos/insertar', data);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el insumo");
    }
  } catch (error) {
    throw error; 
  }
};

export const listarInsumoServicio = async () => {
  try {
    const respuesta = await API.get('/insumos/');
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al listar los insumos");
    }
    return respuesta.data.insumos;
  }
  catch (error) {
    throw error;
  }
};

export const obtenerInsumoIdServicio = async (id) => {
  try {
    const respuesta = await API.get(`/insumos/${id}`);
    if (!respuesta.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el insumo");
    }
    return respuesta.ok;
  }
  catch (error) {
    throw error;
  }
};

export const actualizarInsumoServicio = async (id, data) => {
  try {
    const respuesta = await API.put(`/insumos/actualizar/${id}`, data);

    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al actualizar el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    throw error;
  }
};

export const eliminarInsumoServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/insumos/eliminar/${id}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al eliminar el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    throw error;
  }
};