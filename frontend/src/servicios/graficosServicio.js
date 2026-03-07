import API from "./axiosConfiguracion";

export const obtenerTopProductosMasVendidosServicio = async (fechaInicio, fechaFin) => {
  let url = `/fuente-datos/top-productos`;
  if (fechaInicio && fechaFin) url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

  const respuesta = await API.get(url);
  if (respuesta.data?.ok) return respuesta.data.resultado;
  throw new Error(respuesta.data?.mensaje || "Error al obtener productos más vendidos");
};

export const obtenerResumenVentasEgresosMensualServicio = async (cantidadMeses) => {
  let url = `/fuente-datos/ingresos-egresos`;
  if (cantidadMeses) url += `?meses=${cantidadMeses}`;

  const respuesta = await API.get(url);
  if (respuesta.data?.ok) return respuesta.data.resultado;
  throw new Error(respuesta.data?.mensaje || "Error al obtener resumen de ventas y egresos");
};

export const obtenerPorcentajeMediosPagoServicio = async () => {
  const respuesta = await API.get("/fuente-datos/porcentaje-medios-pago");
  if (respuesta.data?.ok) return respuesta.data.resultado;
  throw new Error(respuesta.data?.mensaje || "Error al obtener porcentaje de medios de pago");
};

export const obtenerVentasPorMesServicio = async (cantidadMeses) => {
  let url = `/fuente-datos/ventas-mes`;
  if (cantidadMeses) url += `?meses=${cantidadMeses}`;

  const respuesta = await API.get(url);
  if (respuesta.data?.ok) return respuesta.data.resultado;
  throw new Error(respuesta.data?.mensaje || "Error al obtener ventas por mes");
};