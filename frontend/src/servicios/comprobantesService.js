import API from "./axiosConfiguracion";
export const obtenerTiposComprobantes = async () => {
    const respuesta = await API.get(`${apiUrl}/ventas/tipos-comprobantes`)
    if(!respuesta.data.ok){
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    return respuesta.data.tiposComprobantes;
}