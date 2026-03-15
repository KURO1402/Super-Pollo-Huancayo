import API from './axiosConfiguracion';

export const obtenerMediosPagoServicio = async () => {
  try {
    const respuesta = await API.get('/medios-pago');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.medios_pago ?? [];
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener medios de pago');
    }
  } catch (error) {
    throw error;
  }
};

export const crearMedioPagoServicio = async (payload) => {
  try {
    const respuesta = await API.post('/medios-pago/agregar', payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al crear medio de pago');
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarMedioPagoServicio = async (id, payload) => {
  try {
    const respuesta = await API.put(`/medios-pago/actualizar/${id}`, payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al actualizar medio de pago');
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarMedioPagoServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/medios-pago/eliminar/${id}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al eliminar medio de pago');
    }
  } catch (error) {
    throw error;
  }
};