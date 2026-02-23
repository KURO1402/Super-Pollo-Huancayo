import API from "./axiosConfiguracion";

export const abrirCajaServicio = async (data) => {
  console.log("Datos recibidos en abrirCajaServicio:", data);
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
      otros:Number(data.otros) || 0
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

export const obtenerCajasCerradasServicio = async (limit = 10, offset = 0) => {
  try {
    if (limit < 0 || offset < 0) {
      throw new Error("Los valores de limit y offset deben ser positivos");
    }

    const respuesta = await API.get(`/caja/registros-caja`, {
      params: { limit, offset }, 
    });

    const data = respuesta?.data;

    if (!Array.isArray(data)) {
      throw new Error("Formato de respuesta inválido: se esperaba un array");
    }

    const camposEsperados = ["idCaja", "fecha", "nombreUsuario", "montoActual"];
    const formatoValido = data.every((caja) =>
      camposEsperados.every((campo) => campo in caja)
    );

    if (!formatoValido) {
      throw new Error("Algunas cajas cerradas no tienen los campos esperados");
    }

    return data;
  } catch (error) {
    throw new Error("Error al obtener las cajas cerradas");
  }
};