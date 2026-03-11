import API from "./axiosConfiguracion";

export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {
  try {
    const respuesta = await API.get('/reservaciones/mesas/disponibles', {
      params: {
        fecha,
        hora: hora + ':00'
      }
    });
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } 
    else if (respuesta.data && Array.isArray(respuesta.data.mesas)) {
      return { 
        ok: true, 
        mesas: respuesta.data.mesas 
      };
    }
    else if (Array.isArray(respuesta.data)) {
      return { 
        ok: true, 
        mesas: respuesta.data 
      };
    }
    else {
      throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
    }
  } catch (error) {
    throw error;
  }
};

export const registrarReservacionServicio = async (data) => {
  try {
    const respuesta = await API.post('/reservaciones', data);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

export const generarPreferenciaMercadoPago = async (reservationId) => {
  try {
    const respuesta = await API.post(`/reservaciones/${reservationId}/crear-preferencia`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

export const obtenerReservacionesPorUsuario = async () => {
  try {
    const respuesta = await API.get(`/reservaciones/reservas-usuario`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

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

export const crearReservacionServicio = async (datosReservacion) => {
  try {
    const respuesta = await API.post('/reservaciones', datosReservacion);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear reservación");
    }
  } catch (error) {

    throw error;
  }
};

export const obtenerDetalleReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}/detalle`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener detalle de reservación");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarReservacionServicio = async (idReservacion, datosActualizados) => {
  try {
    const respuesta = await API.put(`/reservaciones/${idReservacion}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar reservación");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerMesasDisponiblesAdminServicio = async (fecha, hora) => {
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