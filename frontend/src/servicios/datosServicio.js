import API from "./axiosConfiguracion";

export const obtenerVentasHoyComparacionServicio = async () => {
    const respuesta = await API.get('/fuente-datos/ventas-hoy');
    if (respuesta.data?.ok) return respuesta.data.resultado;
    throw new Error(respuesta.data?.mensaje || 'Error al obtener ventas de hoy');
};

export const obtenerCantidadVentasHoyComparacionServicio = async () => {
  try {
    const url = `/fuente-datos/cantidad-ventas`;

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener cantidad de ventas y comparación");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerReservasHoyComparacionServicio = async () => {
  try {
    const url = "/fuente-datos/cantidad-reservaciones"; 
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener reservas de hoy y comparación");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerBalanceAnualServicio = async () => {
  try {
    const url = "/fuente-datos/balance-anual"; 
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener el balance anual");
    }
  } catch (error) {
    throw error;
  }
};