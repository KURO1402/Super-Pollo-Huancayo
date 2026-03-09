import { create } from 'zustand';
import {
  listarReservacionesPorRangoServicio,
  obtenerReservacionPorIdServicio,
  crearReservacionManualServicio,
  cancelarReservacionServicio,
} from '../servicios/reservacionesServicio';

export const useReservacionAdminStore = create((set, get) => ({
  reservaciones: [],
  reservacionDetalle: null,
  cargando: false,
  cargandoDetalle: false,
  guardando: false,
  error: null,

  cargarReservacionesPorRango: async (fechaInicio, fechaFin) => {
    try {
      const reservaciones = await listarReservacionesPorRangoServicio(fechaInicio, fechaFin);
      set({ reservaciones: Array.isArray(reservaciones) ? reservaciones : [], error: null });
    } catch (error) {
      if (error.response?.status === 404 || error.message?.toLowerCase().includes('no hay')) {
        set({ reservaciones: [] });
        return;
      }
      set({ error: 'Error al cargar las reservaciones', reservaciones: [] });
    }
  },

  cargarReservacionPorId: async (idReservacion) => {
    try {
      set({ cargandoDetalle: true, reservacionDetalle: null, error: null });
      const respuesta = await obtenerReservacionPorIdServicio(idReservacion);
      set({ reservacionDetalle: respuesta.reservacion ?? null });
    } catch (error) {
      set({ error: 'Error al obtener el detalle de la reservación' });
      throw error;
    } finally {
      set({ cargandoDetalle: false });
    }
  },

  crearReservacionManual: async (datos) => {
    try {
      set({ guardando: true, error: null });
      const respuesta = await crearReservacionManualServicio(datos);
      return respuesta;
    } catch (error) {
      set({ error: 'Error al crear la reservación' });
      throw error;
    } finally {
      set({ guardando: false });
    }
  },

  cancelarReservacion: async (idReservacion) => {
    try {
      set({ guardando: true, error: null });
      await cancelarReservacionServicio(idReservacion);

      set((state) => ({
        reservaciones: state.reservaciones.map((r) =>
          r.id_reservacion === idReservacion
            ? { ...r, estado_reservacion: 'cancelado' }
            : r
        ),
      }));
    } catch (error) {
      set({ error: 'Error al cancelar la reservación' });
      throw error;
    } finally {
      set({ guardando: false });
    }
  },

  limpiarDetalle: () => set({ reservacionDetalle: null, error: null }),
}));