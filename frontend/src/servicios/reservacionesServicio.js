import API from "./axiosConfiguracion";

// PARA EL ADMIN
export const listarReservacionesPorRangoServicio = async (fechaInicio, fechaFin) => {
  try {
    const respuesta = await API.get('/reservaciones/calendario', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
    });

    if (respuesta.data?.ok) return respuesta.data.reservaciones || [];
    if (Array.isArray(respuesta.data?.reservaciones)) return respuesta.data.reservaciones;
    if (Array.isArray(respuesta.data)) return respuesta.data;

    return [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
};

export const obtenerReservacionPorIdServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}`);

    if (respuesta.data?.ok) {
      return respuesta.data;
    }
    throw new Error(respuesta.data?.mensaje || "Error al obtener la reservación");
  } catch (error) {
    throw error;
  }
};

export const crearReservacionManualServicio = async (datos) => {
  try {
    const respuesta = await API.post('/reservaciones/reserva-manual', datos);

    if (respuesta.data?.ok) {
      return respuesta.data;
    }
    throw new Error(respuesta.data?.mensaje || "Error al crear la reservación manual");
  } catch (error) {
    throw error;
  }
};

export const cancelarReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.patch(`/reservaciones/cancelar-reservacion/${idReservacion}`);

    if (respuesta.data?.ok) {
      return respuesta.data;
    }
    throw new Error(respuesta.data?.mensaje || "Error al cancelar la reservación");
  } catch (error) {
    throw error;
  }
};

export const buscarReservacionPorCodigoServicio = async (codigo) => {
  try {
    const respuesta = await API.get(`/reservaciones/reservacion-codigo/${codigo}`);
    if (respuesta.data?.ok) return respuesta.data;
    throw new Error(respuesta.data?.mensaje || 'Error al buscar la reservación');
  } catch (error) {
    throw error;
  }
};

export const confirmarReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.patch(`/reservaciones/confirmar-reservacion/${idReservacion}`);
    if (respuesta.data?.ok) return respuesta.data;
    throw new Error(respuesta.data?.mensaje || 'Error al confirmar la reservación');
  } catch (error) {
    throw error;
  }
};

// PARA EL USUARIO

export const crearReservaUsuarioServicio = async (datos) => {
  try {
    const respuesta = await API.post('/reservaciones/crear-reserva', datos);
    if (respuesta.data?.ok) return respuesta.data;
    throw new Error(respuesta.data?.mensaje || 'Error al crear la reserva');
  } catch (error) {
    throw error;
  }
};

export const obtenerReservacionesPorUsuario = async () => {
  try {
    const respuesta = await API.get("/reservaciones/mis-reservaciones");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// PARA AMBOS

export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {
  try {
    const respuesta = await API.get('/reservaciones/mesas', {
      params: { fecha, hora }
    });
    if (respuesta.data?.ok) return respuesta.data.mesas || [];
    return [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
};