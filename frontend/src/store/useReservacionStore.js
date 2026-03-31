import { create } from 'zustand'
import {
  obtenerMesasDisponiblesServicio,
  crearReservaUsuarioServicio,
} from '../servicios/reservacionesServicio';

export const useReservacionStore = create((set, get) => ({
  pasoActual: 1,
  datos: {
    fecha: '',
    hora: '',
    personas: 1,
    mesas: [],
  },

  mesasDisponibles: [],
  cargandoMesas: false,
  errorMesas: null,

  reservaCreada: null,
  creandoReserva: false,
  errorReserva: null,

  _pollingInterval: null,

  setPaso: (paso) => set({ pasoActual: Math.max(1, Math.min(3, paso)) }),

  updateDatos: (nuevosDatos) => set((state) => ({
    datos: { ...state.datos, ...nuevosDatos }
  })),

  buscarMesasDisponibles: async (fecha, hora) => {
    if (!fecha || !hora) {
      set({ mesasDisponibles: [], errorMesas: 'Fecha y hora son requeridas' });
      return;
    }
    set({ cargandoMesas: true, errorMesas: null });
    try {
      const mesas = await obtenerMesasDisponiblesServicio(fecha, hora);
      const mesasTransformadas = mesas.map(mesa => ({
        id: mesa.id_mesa,
        numero: mesa.numero_mesa.toString(),
        capacidad: mesa.capacidad,
        disponible: mesa.estado === 'disponible',
      }));
      set({ mesasDisponibles: mesasTransformadas, cargandoMesas: false, errorMesas: null });
    } catch (error) {
      set({ mesasDisponibles: [], cargandoMesas: false, errorMesas: error.message || 'Error al cargar mesas disponibles' });
    }
  },

  actualizarMesasSilencioso: async () => {
    const { datos } = get();
    if (!datos.fecha || !datos.hora) return;
    try {
      const mesas = await obtenerMesasDisponiblesServicio(datos.fecha, datos.hora);
      const mesasTransformadas = mesas.map(mesa => ({
        id: mesa.id_mesa,
        numero: mesa.numero_mesa.toString(),
        capacidad: mesa.capacidad,
        disponible: mesa.estado === 'disponible',
      }));
      set({ mesasDisponibles: mesasTransformadas });
    } catch (_) {}
  },

  iniciarPolling: () => {
    const { _pollingInterval, actualizarMesasSilencioso } = get();
    if (_pollingInterval) clearInterval(_pollingInterval);
    const interval = setInterval(() => {
      actualizarMesasSilencioso();
    }, 30000);
    set({ _pollingInterval: interval });
  },

  detenerPolling: () => {
    const { _pollingInterval } = get();
    if (_pollingInterval) {
      clearInterval(_pollingInterval);
      set({ _pollingInterval: null });
    }
  },

  crearReserva: async () => {
    const { datos } = get();
    const payload = {
      fecha: datos.fecha,
      hora: datos.hora,
      cantidadPersonas: datos.personas,
      mesas: datos.mesas.map(m => ({ idMesa: m.id })),
    };
    set({ creandoReserva: true, errorReserva: null });
    try {
      const respuesta = await crearReservaUsuarioServicio(payload);
      set({ reservaCreada: respuesta, creandoReserva: false });
      return respuesta;
    } catch (error) {
      set({ errorReserva: error.message || 'Error al crear la reserva', creandoReserva: false });
      throw error;
    }
  },

  limpiarMesas: () => set({ mesasDisponibles: [], datos: { ...get().datos, mesas: [] } }),
  getCostoMesas: () => (get().datos.mesas?.length || 0) * 15,
  getAnticipo: () => Math.round(get().getCostoMesas() * 0.5 * 100) / 100,
  getTotal: () => get().getCostoMesas(),
  getSaldoPendiente: () => get().getTotal() - get().getAnticipo(),
  puedeAvanzarPaso1: () => { const { datos } = get(); return datos.fecha && datos.hora && datos.personas >= 2; },
  puedeAvanzarPaso2: () => {
    const { datos } = get();
    if (!datos.mesas || datos.mesas.length === 0) return false;
    return datos.mesas.reduce((t, m) => t + m.capacidad, 0) >= datos.personas;
  },

  resetReserva: () => {
    get().detenerPolling();
    set({
      pasoActual: 1,
      datos: { fecha: '', hora: '', personas: 2, mesas: [] },
      mesasDisponibles: [], cargandoMesas: false, errorMesas: null,
      reservaCreada: null, creandoReserva: false, errorReserva: null,
    });
  }
}));