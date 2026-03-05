import API from "./axiosConfiguracion";

export const obtenerTiposDocumento = async () => {
  const respuesta = await API.get(`/tipos-documento`);
  if(!respuesta.data.ok){
     throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de documento");
  }
  return respuesta.data.tipos_documento;
};