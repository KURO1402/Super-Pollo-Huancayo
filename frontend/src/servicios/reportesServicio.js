import API from './axiosConfiguracion';

export const descargarReporteExcelServicio = async (tipoReporte, desde, hasta) => {
  try {
    const respuesta = await API.get(`reportes/${tipoReporte}`, {
      params: { desde, hasta },
      responseType: 'blob'
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};