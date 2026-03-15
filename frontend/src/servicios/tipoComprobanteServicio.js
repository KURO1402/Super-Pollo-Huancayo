import API from './axiosConfiguracion';

export const obtenerTiposComprobanteServicio = async () => {
  try {
    const respuesta = await API.get('/tipos-comprobante/');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.tipos_comprobante ?? [];
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener tipos de comprobante');
    }
  } catch (error) {
    throw error;
  }
};

export const crearTipoComprobanteServicio = async (payload) => {
  try {
    const respuesta = await API.post('/tipos-comprobante/agregar', payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al crear tipo de comprobante');
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarTipoComprobanteServicio = async (id, payload) => {
  try {
    const respuesta = await API.put(`/tipos-comprobante/actualizar/${id}`, payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al actualizar tipo de comprobante');
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarTipoComprobanteServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/tipos-comprobante/eliminar/${id}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al eliminar tipo de comprobante');
    }
  } catch (error) {
    throw error;
  }
};