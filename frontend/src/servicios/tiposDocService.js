import API from "./axiosConfiguracion";

export const obtenerTiposDocumentoServicio = async () => {
  try {
    const respuesta = await API.get('/tipos-documento');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.tipos_documento ?? [];
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener tipos de documento');
    }
  } catch (error) {
    throw error;
  }
};

export const crearTipoDocumentoServicio = async (payload) => {
  try {
    const respuesta = await API.post('/tipos-documento/agregar', payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al crear tipo de documento');
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarTipoDocumentoServicio = async (id, payload) => {
  try {
    const respuesta = await API.put(`/tipos-documento/actualizar/${id}`, payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al actualizar tipo de documento');
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarTipoDocumentoServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/tipos-documento/eliminar/${id}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al eliminar tipo de documento');
    }
  } catch (error) {
    throw error;
  }
};