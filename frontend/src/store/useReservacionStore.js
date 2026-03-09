import { create } from 'zustand'
import { obtenerMesasDisponiblesServicio } from '../servicios/reservacionesServicio';

export const useReservacionStore = create((set, get) => ({
  pasoActual: 1,
  datos: {
    fecha: '',
    hora: '',
    personas: 2,
    mesas: [], 
  },
  
  mesasDisponibles: [],
  cargandoMesas: false,
  errorMesas: null,

  setPaso: (paso) => set({ 
    pasoActual: Math.max(1, Math.min(3, paso)) 
  }),
  
  updateDatos: (nuevosDatos) => set((state) => ({ 
    datos: { 
      ...state.datos, 
      ...nuevosDatos
    } 
  })),

  buscarMesasDisponibles: async (fecha, hora) => {
    if (!fecha || !hora) {
      set({ 
        mesasDisponibles: [],
        errorMesas: 'Fecha y hora son requeridas'
      });
      return;
    }

    set({ cargandoMesas: true, errorMesas: null });
    
    try {
      const respuesta = await obtenerMesasDisponiblesServicio(fecha, hora);
      
      const mesasTransformadas = respuesta.mesas.map(mesa => ({
        id: mesa.idMesa,
        numero: mesa.numeroMesa.toString(),
        capacidad: mesa.capacidad,
        disponible: true
      }));

      set({ 
        mesasDisponibles: mesasTransformadas,
        cargandoMesas: false,
        errorMesas: null
      });

    } catch (error) {
      set({ 
        mesasDisponibles: [],
        cargandoMesas: false,
        errorMesas: error.message || 'Error al cargar mesas disponibles'
      });
    }
  },

  limpiarMesas: () => set({ 
    mesasDisponibles: [],
    datos: { ...get().datos, mesas: [] }
  }),

  getCostoMesas: () => {
    const { datos } = get();
    const COSTO_POR_MESA = 15;
    return (datos.mesas?.length || 0) * COSTO_POR_MESA;
  },

  getAnticipo: () => {
    const costoMesas = get().getCostoMesas();
    return Math.round(costoMesas * 0.5 * 100) / 100; 
  },

  getTotal: () => {
    return get().getCostoMesas();
  },

  getSaldoPendiente: () => {
    const total = get().getTotal();
    const anticipo = get().getAnticipo();
    return total - anticipo;
  },

  puedeAvanzarPaso1: () => {
    const { datos } = get();
    return datos.fecha && datos.hora && datos.personas >= 2;
  },

  puedeAvanzarPaso2: () => {
    const { datos } = get();
    
    if (!datos.mesas || datos.mesas.length === 0) {
      return false;
    }
    
    const capacidadTotal = datos.mesas.reduce((total, mesa) => total + mesa.capacidad, 0);
    return capacidadTotal >= datos.personas;
  },

  resetReserva: () => set({
    pasoActual: 1,
    datos: {
      fecha: '',
      hora: '',
      personas: 2,
      mesas: [],
    },
    mesasDisponibles: [],
    cargandoMesas: false,
    errorMesas: null
  })
}));