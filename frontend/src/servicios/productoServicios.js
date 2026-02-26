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

export const obtenerProductoCatalogoServicio = async ( categoriaId = null) => {
  try {
    const url = categoriaId ? `/productos/catalogo?categoria=${categoriaId}` : `/productos/catalogo`;

    const respuesta = await API.get(url);

    if(respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener los productos del catalogo' )
    }
  } catch (error) {
    throw error;
  }
}

export const actualizarProductoServicio = async (idProducto, datosActualizados) => {
  try {
    const respuesta = await API.patch(`/productos/actualizar-producto/${idProducto}`, datosActualizados);

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

export const agregarInsumoProductoServicio = async (idProducto, datos) => {
  try {
    const respuesta = await API.post(`/productos/agregar-cantidad-insumo/${idProducto}`, datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al agregar insumo al producto");
    }
  } catch (error) {
    throw error;
  }
};

export const modificarCantidadInsumoServicio = async (idProducto, datos) => {
  try {
    const respuesta = await API.patch(`/productos/actualizar-cantidad-insumo/${idProducto}`, datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al modificar cantidad del insumo");
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarInsumoProductoServicio = async (idProducto, datos) => {
  try {
    const respuesta = await API.delete(`/productos/eliminar-cantidad-insumo/${idProducto}`, { data: datos });

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
    const respuesta = await API.get(`/productos/insumos/${idProducto}`);

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

export const obtenerImagenesProductoServicio = async () => {
  try {
    const respuesta = await API.get('/productos/imagenes');

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener las imágenes de productos");
    }
  } catch (error) {
    throw error;
  }
}

export const actualizarImagenProductoServicio = async (idProducto, formData) => {
  try {
    
    const respuesta = await API.put(`/productos/actualizar-imagen/${idProducto}`, formData,);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar la imagen");
    }
  } catch (error) {
    throw error;
  }
};

export const habilitarProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.patch(`/productos/habilitar-producto/${idProducto}`);

    if (respuesta.data && respuesta.data.ok){
      return respuesta.data;
    }
  } catch (error) {
    throw error;
  }
}

export const deshabilitarProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.patch(`/productos/deshabilitar-producto/${idProducto}`);

    if (respuesta.data && respuesta.data.ok){
      return respuesta.data;
    }
  } catch (error) {
    throw error;
  }
}