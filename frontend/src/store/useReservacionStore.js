import { create } from 'zustand'
import { obtenerMesasDisponiblesServicio } from '../servicios/reservacionesServicio';

export const useReservacionStore = create((set, get) => ({
  // Estado
  pasoActual: 1,
  datos: {
    fecha: '',
    hora: '',
    personas: 2,
    mesas: [], // Array de objetos { id, numero, capacidad, piso, disponible }
  },
  
  mesasDisponibles: [],
  cargandoMesas: false,
  errorMesas: null,

  // Cambiar paso
  setPaso: (paso) => set({ 
    pasoActual: Math.max(1, Math.min(3, paso)) 
  }),
  
  // Actualizar datos de reserva
  updateDatos: (nuevosDatos) => set((state) => ({ 
    datos: { 
      ...state.datos, 
      ...nuevosDatos
    } 
  })),

  // Buscar mesas disponibles (opcional - para futuras implementaciones)
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

  // Limpiar mesas
  limpiarMesas: () => set({ 
    mesasDisponibles: [],
    datos: { ...get().datos, mesas: [] }
  }),

  // Calcular costo total de mesas (S/ 15 por mesa)
  getCostoMesas: () => {
    const { datos } = get();
    const COSTO_POR_MESA = 15;
    return (datos.mesas?.length || 0) * COSTO_POR_MESA;
  },

  // Calcular anticipo (50% del costo de mesas)
  getAnticipo: () => {
    const costoMesas = get().getCostoMesas();
    return Math.round(costoMesas * 0.5 * 100) / 100; 
  },

  // Obtener total (igual al costo de mesas)
  getTotal: () => {
    return get().getCostoMesas();
  },

  // Calcular saldo pendiente
  getSaldoPendiente: () => {
    const total = get().getTotal();
    const anticipo = get().getAnticipo();
    return total - anticipo;
  },

  // Validar si puede avanzar del Paso 1
  puedeAvanzarPaso1: () => {
    const { datos } = get();
    return datos.fecha && datos.hora && datos.personas >= 2;
  },

  // Validar si puede avanzar del Paso 2
  puedeAvanzarPaso2: () => {
    const { datos } = get();
    
    // Verificar que haya mesas seleccionadas
    if (!datos.mesas || datos.mesas.length === 0) {
      return false;
    }
    
    // Verificar que la capacidad total sea suficiente
    const capacidadTotal = datos.mesas.reduce((total, mesa) => total + mesa.capacidad, 0);
    return capacidadTotal >= datos.personas;
  },

  // Resetear reserva
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