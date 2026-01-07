import API from "./axiosConfiguracion";

export const obtenerCategoriasServicio = async () => {
  try {
    const respuesta = await API.get('/productos/categorias/all');
    
    if (respuesta.data.ok) {
      return respuesta.data.categorias;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al obtener categorías");
    }
  } catch (error) {
    throw error;
  }
};

export const crearCategoriaServicio = async (nombreCategoria) => {
  try {
    const respuesta = await API.post('/productos/categorias/agregar', {
      nombreCategoria: nombreCategoria
    });
    
    if (respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al crear categoría");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarCategoriaServicio = async (idCategoria, nombreCategoria) => {
  try {
    const respuesta = await API.put(`/productos/categorias/actualizar/${idCategoria}`, {
      nombreCategoria: nombreCategoria
    });
    
    if (respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al actualizar categoría");
    }
  } catch (error) {
    throw error;
  }
};