import API from "./axiosConfiguracion"
export const generarBoletaServicio = async (datos) => {
    const respuesta = await API.post("/ventas/generar-boleta", datos)
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    return respuesta.data;
}

export const generarFacturaServicio = async (datos) => {
    const respuesta = await API.post("/ventas/generar-factura", datos)
    if(!respuesta.data.ok){
        
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    return respuesta.data;
}
export const obtenerMetodosPagoServicio = async () => {
    try {
        const respuesta = await API.get("/ventas/medios-pago")
        if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener los medios de pago");
    }
    return respuesta.data.medios;
    } catch (error) {
    }
}

export const obtenerVentasServicio = async () => {
    const respuesta = await API.get("/ventas/resumen");
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener las ventas");
    }
    return respuesta.data.ventas;
}

export const obtenerDetalleVentaServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/detalle-venta/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el detalle de la venta");
    }
    return respuesta.data.detalles;
}

export const obtenerComprobanteServicio = async (idVenta) => {
    const respuesta = await API.get(`/ventas/comprobante/${idVenta}`);
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener el comprobante");
    }
    return respuesta.data.comprobante[0];
}