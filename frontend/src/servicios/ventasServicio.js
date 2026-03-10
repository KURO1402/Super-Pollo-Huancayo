import API from "./axiosConfiguracion"

export const generarVentaServicio = async (ventaData) => {
  try {
    const respuesta = await API.post('/ventas/generar-venta', ventaData);
    return respuesta.data;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || 'Error al generar la venta';
    throw new Error(mensaje);
  }
};

export const obtenerMetodosPagoServicio = async () => {
    try {
        const respuesta = await API.get("/medios-pago")
        if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener los medios de pago");
    }
    return respuesta.data.medios_pago;
    } catch (error) {
    }
}

export const obtenerVentasServicio = async ({ limit, offset } = {}) => {
    try {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        
        const respuesta = await API.get(`/ventas?${params}`);
        
        if (!respuesta.data.ok) {
            throw new Error(respuesta.data.mensaje || "Error al listar las ventas");
        }
        
        return {
            ventas: respuesta.data.ventas || [],
            cantidad_filas: respuesta.data.cantidad_filas || 0
        };
    } catch (error) {
        console.error('Error en listarVentasServicio:', error);
        throw error;
    }
};

export const obtenerDetalleVentaServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/detalle-venta/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el detalle de la venta");
    }
    return respuesta.data.detalles_venta;
}

export const obtenerComprobanteServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/comprobante-venta/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el comprobante");
    }
    return respuesta.data.comprobante;
}