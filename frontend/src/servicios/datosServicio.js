import API from "./axiosConfiguracion";

export const obtenerVentasHoyComparacionServicio = async () => {
    const respuesta = await API.get('/fuente-datos/ventas-hoy');
    if (respuesta.data?.ok) return respuesta.data.resultado;
    throw new Error(respuesta.data?.mensaje || 'Error al obtener ventas de hoy');
};

export const obtenerCantidadVentasHoyComparacionServicio = async () => {
    const respuesta = await API.get('/fuente-datos/cantidad-ventas');
    if (respuesta.data?.ok) return respuesta.data.resultado;
    throw new Error(respuesta.data?.mensaje || 'Error al obtener cantidad de ventas y comparación');
};

export const obtenerReservasMesComparacionServicio = async () => {
    const respuesta = await API.get('/fuente-datos/cantidad-reservaciones');
    if (respuesta.data?.ok) return respuesta.data.resultado;
    throw new Error(respuesta.data?.mensaje || 'Error al obtener reservas de hoy y comparación');
};

export const obtenerBalanceAnualServicio = async () => {
    const respuesta = await API.get('/fuente-datos/balance-anual');
    if (respuesta.data?.ok) return respuesta.data.resultado;
    throw new Error(respuesta.data?.mensaje || 'Error al obtener el balance anual');
};