import API from "./axiosConfiguracion";

// Servicio para obtener los 5 productos más vendidos
export const obtenerTopProductosMasVendidosServicio = async (fechaInicio, fechaFin) => {
  try {

    let url = `/fuente-datos/top-productos`;

    // Si hay filtros, agregarlos a la URL
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; 
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener productos más vendidos");
    }

  } catch (error) {
    throw error;
  }
};

export const obtenerResumenVentasEgresosMensualServicio = async (cantidadMeses) => {
  try {
    let url = `/fuente-datos/ingresos-egresos`;

    if (cantidadMeses) {
      url += `?meses=${cantidadMeses}`;
    }
    console.log(url)
    const respuesta = await API.get(url);
    console.log(respuesta);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.data;
    } else {
      
      throw new Error(respuesta.data?.mensaje || "Error al obtener resumen de ventas y egresos");
    }
  } catch (error) {
    console.log(error.message)
    throw error;
  }
};

export const obtenerPorcentajeMediosPagoServicio = async () => {
  try {
    const url = "/fuente-datos/porcentaje-medios-pago"; 
    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener porcentaje de medios de pago");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerVentasPorMesServicio = async (cantidadMeses) => {
  try {
    let url = `/fuente-datos/ventas-mes`;

    // Agregar parámetro de cantidad de meses si viene
    if (cantidadMeses) {
      url += `?meses=${cantidadMeses}`;
    }

    const respuesta = await API.get(url);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.resultado; // Array directamente usable en gráficos
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener ventas por mes");
    }
  } catch (error) {
    throw error;
  }
};