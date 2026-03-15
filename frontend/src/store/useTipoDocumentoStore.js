import { create } from 'zustand';
import {
  obtenerTiposDocumentoServicio,
  crearTipoDocumentoServicio,
  actualizarTipoDocumentoServicio,
  eliminarTipoDocumentoServicio,
} from '../servicios/tiposDocService';

export const useTipoDocumentoStore = create((set, get) => ({
  tiposDocumento: [],
  cargando: false,
  error: null,

  cargarTiposDocumento: async () => {
    set({ cargando: true, error: null });
    try {
      const tiposDocumento = await obtenerTiposDocumentoServicio();
      set({ tiposDocumento });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ cargando: false });
    }
  },

  crearTipoDocumento: async (payload) => {
    set({ cargando: true, error: null });
    try {
      await crearTipoDocumentoServicio(payload);
      await get().cargarTiposDocumento();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  actualizarTipoDocumento: async (id, payload) => {
    set({ cargando: true, error: null });
    try {
      await actualizarTipoDocumentoServicio(id, payload);
      await get().cargarTiposDocumento();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  eliminarTipoDocumento: async (id) => {
    set({ cargando: true, error: null });
    try {
      await eliminarTipoDocumentoServicio(id);
      await get().cargarTiposDocumento();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));