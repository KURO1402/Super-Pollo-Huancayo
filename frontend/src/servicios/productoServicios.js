import API from "./axiosConfiguracion";

export const crearProductoServicio = async (formData) => {
  try {
    const respuesta = await API.post('/productos/agregar-producto', formData);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el producto");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerProductosServicio = async () => {
  try {
    const respuesta = await API.get('/productos/');
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener los productos");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarProductoServicio = async (idProducto, datosActualizados) => {
  try {
    
    const respuesta = await API.put(`/productos/actualizar-producto/${idProducto}`, datosActualizados);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar el producto");
    }
  } catch (error) {
    throw error;
  }
};
export const eliminarProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.delete(`/productos/eliminar-producto/${idProducto}`);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al eliminar el producto");
    }
  } catch (error) {
    throw error;
  }
};

export const agregarInsumoProductoServicio = async (datos) => {
  try {
    
    const respuesta = await API.post('/productos/agregar-cantidad', datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al agregar insumo al producto");
    }
  } catch (error) {
    throw error;
  }
};

export const modificarCantidadInsumoServicio = async (datos) => {
  try {
    
    const respuesta = await API.patch('/productos/modificar-cantidad', datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al modificar cantidad del insumo");
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarInsumoProductoServicio = async (datos) => {
  try {
    
    const respuesta = await API.delete('/productos/eliminar-cantidad', { data: datos });

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al eliminar insumo del producto");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerInsumosProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.get(`/productos/insumos-cantidad/${idProducto}`);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener insumos del producto");
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        ok: true,
        insumos: []
      };
    }
    throw error;
  }
};

export const actualizarImagenProductoServicio = async (idProducto, formData) => {
  try {
    
    const respuesta = await API.put(`/productos/actualizar-imagen/${idProducto}`, formData);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar la imagen");
    }
  } catch (error) {
    throw error;
  }
};