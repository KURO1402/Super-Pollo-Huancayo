import API from "./axiosConfiguracion";

export const crearInsumoServicio = async (data) => {
  try {
    const respuesta = await API.post('/insumos/agregar-insumo', data);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el insumo");
    }
  } catch (error) {
    throw error; 
  }
};

export const listarInsumoServicio = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset !== undefined) queryParams.append('offset', params.offset);
    if (params.insumo) queryParams.append('insumo', params.insumo);
    if (params.nivelStock) queryParams.append('nivelStock', params.nivelStock);

    const respuesta = await API.get(`/insumos/?${queryParams.toString()}`);

    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al listar los insumos");
    }
    return respuesta.data;
  } catch (error) {
    // Preservar el error de axios con su response intacto
    throw error;
  }
};

export const obtenerInsumoIdServicio = async (id) => {
  try {
    const respuesta = await API.get(`/insumos/insumo/${id}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    throw error;
  }
};

export const actualizarInsumoServicio = async (id, data) => {
  try {
    const respuesta = await API.patch(`/insumos/actualizar-insumo/${id}`, data);

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
    const respuesta = await API.delete(`/insumos/eliminar-insumo/${id}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al eliminar el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    throw error;
  }
};
