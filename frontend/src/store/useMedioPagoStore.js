import { create } from 'zustand';
import {
  obtenerMediosPagoServicio,
  crearMedioPagoServicio,
  actualizarMedioPagoServicio,
  eliminarMedioPagoServicio,
} from '../servicios/medioPagoServicio';

export const useMedioPagoStore = create((set, get) => ({
  mediosPago: [],
  cargando: false,
  error: null,

  cargarMediosPago: async () => {
    set({ cargando: true, error: null });
    try {
      const mediosPago = await obtenerMediosPagoServicio();
      set({ mediosPago });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ cargando: false });
    }
  },

  crearMedioPago: async (payload) => {
    set({ cargando: true, error: null });
    try {
      await crearMedioPagoServicio(payload);
      await get().cargarMediosPago();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  actualizarMedioPago: async (id, payload) => {
    set({ cargando: true, error: null });
    try {
      await actualizarMedioPagoServicio(id, payload);
      await get().cargarMediosPago();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  eliminarMedioPago: async (id) => {
    set({ cargando: true, error: null });
    try {
      await eliminarMedioPagoServicio(id);
      await get().cargarMediosPago();
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));