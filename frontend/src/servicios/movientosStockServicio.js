import API from "./axiosConfiguracion";

export const registrarEntradaServicio = async (data) => {
  try {
    const respuesta = await API.post('/insumos/registrar-entrada', data);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const registrarSalidaServicio = async (data) => {
  try {
    const respuesta = await API.post('/insumos/registrar-salida', data);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const listarMovimientosServicio = async ({ tipoMovimiento, limit, offset } = {}) => {
  try {
    const params = new URLSearchParams({ tipoMovimiento, limit, offset });
    const respuesta = await API.get(`/insumos/movimientos-stock?${params}`);
    
    if (!respuesta.data.ok) throw new Error(respuesta.data.mensaje || "Error al listar los movimientos");
    
    return {
      entradas: respuesta.data.movimientos || [],
      total: respuesta.data.cantidad_filas || 0
    };
  } catch (error) {
    throw error;
  }
};

export const obtenerMovimientoIdServicio = async (id) => {
  try {
    const respuesta = await API.get(`/inventario/movimientos/${id}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el movimiento");
    }
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};