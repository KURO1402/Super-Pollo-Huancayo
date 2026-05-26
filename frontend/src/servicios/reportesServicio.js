import API from './axiosConfiguracion';

export const descargarReporteExcelServicio = async (tipoReporte, desde, hasta) => {
  try {
    const respuesta = await API.get(`reportes/${tipoReporte}`, {
      params: { desde, hasta },
      responseType: 'blob'
    });

    if (respuesta.data && respuesta.data.type === 'application/json') {
      const textoError = await respuesta.data.text();
      const jsonError = JSON.parse(textoError);
      throw new Error(jsonError.mensaje || 'Error al generar el reporte');
    }

    return respuesta.data;
  } catch (error) {
    throw error;
  }
};