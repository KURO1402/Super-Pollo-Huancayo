import { create } from 'zustand';
import {
  obtenerTiposComprobanteServicio,
  crearTipoComprobanteServicio,
  actualizarTipoComprobanteServicio,
  eliminarTipoComprobanteServicio,
} from '../servicios/tipoComprobanteServicio';

export const useTipoComprobanteStore = create((set, get) => ({
  tiposComprobante: [],
  cargando: false,
  error: null,

  cargarTiposComprobante: async () => {
    set({ cargando: true, error: null });
    try {
      const tiposComprobante = await obtenerTiposComprobanteServicio();
      set({ tiposComprobante });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ cargando: false });
    }
  },

  crearTipoComprobante: async (payload) => {
    set({ cargando: true, error: null });
    try {
      await crearTipoComprobanteServicio(payload);
      await get().cargarTiposComprobante();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  actualizarTipoComprobante: async (id, payload) => {
    set({ cargando: true, error: null });
    try {
      await actualizarTipoComprobanteServicio(id, payload);
      await get().cargarTiposComprobante();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  eliminarTipoComprobante: async (id) => {
    set({ cargando: true, error: null });
    try {
      await eliminarTipoComprobanteServicio(id);
      await get().cargarTiposComprobante();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));