import { create } from 'zustand';
import {
  obtenerCategoriasServicio,
  crearCategoriaServicio,
  actualizarCategoriaServicio,
  eliminarCategoriaServicio,
} from '../servicios/categoriasServicio';

export const useCategoriaStore = create((set, get) => ({
  categorias: [],
  cargando: false,
  error: null,

  cargarCategorias: async () => {
    set({ cargando: true, error: null });
    try {
      const categorias = await obtenerCategoriasServicio();
      set({ categorias });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ cargando: false });
    }
  },

  crearCategoria: async (payload) => {
    set({ cargando: true, error: null });
    try {
      await crearCategoriaServicio(payload);
      await get().cargarCategorias();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  actualizarCategoria: async (id, payload) => {
    set({ cargando: true, error: null });
    try {
      await actualizarCategoriaServicio(id, payload);
      await get().cargarCategorias();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  eliminarCategoria: async (id) => {
    set({ cargando: true, error: null });
    try {
      await eliminarCategoriaServicio(id);
      await get().cargarCategorias();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));