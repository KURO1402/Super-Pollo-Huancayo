import API from "./axiosConfiguracion";

// ── Generar venta ─────────────────────────────────────────────────────────────
export const generarVentaServicio = async (ventaData) => {
  try {
    const respuesta = await API.post("/ventas/generar-venta", ventaData);
    return respuesta.data;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al generar la venta";
    throw new Error(mensaje);
  }
};

// ── Anular venta ──────────────────────────────────────────────────────────────
export const anularVentaServicio = async (idVenta) => {
  try {
    const respuesta = await API.delete(`/ventas/anular-venta/${idVenta}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al anular la venta");
    }
    return respuesta.data;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al anular la venta";
    throw new Error(mensaje);
  }
};

// ── Obtener tipos de comprobante ──────────────────────────────────────────────
export const obtenerTiposComprobanteServicio = async () => {
  try {
    const respuesta = await API.get("/tipos-comprobante");
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobante");
    }
    return respuesta.data.tipos_comprobante;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al obtener tipos de comprobante";
    throw new Error(mensaje);
  }
};

// ── Obtener métodos de pago ───────────────────────────────────────────────────
export const obtenerMetodosPagoServicio = async () => {
  try {
    const respuesta = await API.get("/medios-pago");
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener los medios de pago");
    }
    return respuesta.data.medios_pago;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al obtener medios de pago";
    throw new Error(mensaje);
  }
};

// ── Listar ventas (paginado + filtro fechas) ──────────────────────────────────
export const obtenerVentasServicio = async ({ limit, offset, fechaInicio, fechaFin } = {}) => {
  try {
    const params = new URLSearchParams();
    if (limit)       params.append("limit",       limit);
    if (offset)      params.append("offset",      offset);
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin)    params.append("fechaFin",    fechaFin);

    const respuesta = await API.get(`/ventas?${params}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al listar las ventas");
    }
    return {
      ventas:        respuesta.data.ventas        || [],
      cantidad_filas: respuesta.data.cantidad_filas || 0,
    };
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al listar ventas";
    throw new Error(mensaje);
  }
};

// ── Detalle de venta ──────────────────────────────────────────────────────────
export const obtenerDetalleVentaServicio = async (idVenta) => {
  try {
    const respuesta = await API.get(`/ventas/detalle-venta/${idVenta}`);
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el detalle");
    }
    return respuesta.data.detalles_venta;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.message || "Error al obtener detalle";
    throw new Error(mensaje);
  }
};