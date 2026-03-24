import API from "./axiosConfiguracion";

export const abrirCajaServicio = async (data) => {
  try {
    const respuesta = await API.post('/caja/abrir-caja', {
      montoInicial: Number(data.montoInicial)
    });
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al abrir una caja");
    }
    
    if (!respuesta.data.caja.id_caja) {
      throw new Error("No se recibió el ID de la caja");
    }
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarCajaServicio = async () => {
  try {
    const respuesta = await API.post('/caja/cerrar-caja');
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al cerrar una caja");
    }
    
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const registrarIngresoServicio = async (data) => {
  try {
    const datosParaBackend = {
      monto: Number(data.monto),
      descripcion: data.descripcion.trim(),
    };
    
    const respuesta = await API.post('/caja/registrar-ingreso', datosParaBackend);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar ingreso");
    }
    
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const registrarEgresoServicio = async (data) => {
  try {
    const datosParaBackend = {
      monto: Number(data.monto),
      descripcion: data.descripcion.trim(),
    };
    
    const respuesta = await API.post('/caja/registrar-egreso', datosParaBackend);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar egreso");
    }
    
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const registrarArqueoServicio = async (data) => {
  try {
    const datosParaBackend = {
      montoFisico: Number(data.montoFisico) || 0,       
      montoTarjeta: Number(data.montoTarjeta) || 0,        
      montoBilleteraDigital: Number(data.montoBilleteraDigital) || 0,
      montoOtros:Number(data.otros) || 0,
      descripcionArqueo: data.descripcionArqueo?.trim() || undefined
    }
    const respuesta = await API.post('/caja/arqueo-caja', datosParaBackend);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar arqueo");
    }
    
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerMovimientosPorCajaServicio = async (
  idCaja,
  { limit = 10, offset = 0 } = {}
) => {
  const { data } = await API.get(
    `/caja/movimientos-caja/${idCaja}`,
    { params: { limit, offset } }
  );

  return {
    movimientos: data.movimientos || [],
    cantidad_filas: Number(data.cantidad_filas) || 0
  };
};

export const obtenerArqueosPorCajaServicio = async (idCaja) => {
  try {
    if (!idCaja) {
      throw new Error("El ID de la caja es requerido para obtener los arqueos");
    }

    const respuesta = await API.get(`/caja/arqueos-caja/${idCaja}`);

    const data = respuesta?.data;

    if (!Array.isArray(data)) {
      throw new Error("Formato de respuesta inválido: se esperaba un array");
    }

    return data;
  } catch (error) {
    throw new Error("Error al obtener los arqueos de la caja");
  }
};

export const obtenerCajasCerradasServicio = async ({ limit = 5, offset = 0, fechaInicio, fechaFin, estado } = {}) => {
  try {
    const parametros = new URLSearchParams();
    parametros.append('limit', limit);
    parametros.append('offset', offset);
    
    if (fechaInicio && fechaInicio.trim() !== '') {
      parametros.append('fechaInicio', fechaInicio);
    }
    
    if (fechaFin && fechaFin.trim() !== '') {
      parametros.append('fechaFin', fechaFin);
    }

    const url = `/caja/cajas${parametros.toString() ? `?${parametros.toString()}` : ''}`;
    
    const respuesta = await API.get(url);

    if (respuesta.data) {
      let cajas = [];
      let total = 0;

      if (Array.isArray(respuesta.data)) {
        cajas = respuesta.data;
        total = cajas.length;
      } else if (respuesta.data.cajas) {
        cajas = respuesta.data.cajas;
        total = respuesta.data.cantidad_filas || cajas.length;
      } else {
        cajas = [];
        total = 0;
      }
      return { cajas, total};
    }
    return {
      cajas: [],
      total: 0
    };
  } catch (error) {
    
    if (error.response?.status === 404) {
      return {
        cajas: [],
        total: 0
      };
    }
    return {
      cajas: [],
      total: 0
    };
  }
};

export const obtenerCajaActualServicio = async () => {
  const respuesta = await API.get('/caja/caja-actual');
  if (!respuesta.data.ok) {
    throw new Error(respuesta.data.mensaje || "Error al obtener caja actual");
  }
  return respuesta.data.caja;
};