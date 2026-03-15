import API from './axiosConfiguracion';

export const obtenerCategoriasServicio = async () => {
  try {
    const respuesta = await API.get('categorias-producto');
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.categorias ?? [];
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al obtener categorías');
    }
  } catch (error) {
    throw error;
  }
};

export const crearCategoriaServicio = async (payload) => {
  try {
    const respuesta = await API.post('/categorias-producto/agregar', payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al crear categoría');
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarCategoriaServicio = async (id, payload) => {
  try {
    const respuesta = await API.put(`/categorias-producto/actualizar/${id}`, payload);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al actualizar categoría');
    }
  } catch (error) {
    throw error;
  }
};

export const eliminarCategoriaServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/categorias-producto/eliminar/${id}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al eliminar categoría');
    }
  } catch (error) {
    throw error;
  }
};