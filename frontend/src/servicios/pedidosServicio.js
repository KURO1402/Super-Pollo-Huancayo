import API from "./axiosConfiguracion";

export const obtenerMesasConEstadoServicio = async (fecha, hora) => {
  try {
    const respuesta = await API.get(`/pedidos/mesas?fecha=${fecha}&hora=${hora}`);
    if (!respuesta.data.ok) throw new Error(respuesta.data.mensaje || "Error al obtener mesas");
    return respuesta.data.mesas;
  } catch (error) {
    throw new Error(error.response?.data?.mensaje || error.message || "Error al obtener mesas");
  }
};

export const obtenerPedidoPorMesaServicio = async (idMesa) => {
  try {
    const respuesta = await API.get(`/pedidos/mesa/${idMesa}`);
    if (!respuesta.data.ok) throw new Error(respuesta.data.mensaje || "Error al obtener pedido");
    return respuesta.data;
  } catch (error) {
    throw new Error(error.response?.data?.mensaje || error.message || "Error al obtener pedido");
  }
};

export const completarPedidoServicio = async (idPedido) => {
  try {
    const respuesta = await API.patch(`/pedidos/completar/${idPedido}`);
    if (!respuesta.data.ok) throw new Error(respuesta.data.mensaje || "Error al obtener pedido");
    return respuesta.data.pedido;
  } catch (error) {
    throw new Error(error.response?.data?.mensaje || error.message || "Error al obtener pedido");
  }
};