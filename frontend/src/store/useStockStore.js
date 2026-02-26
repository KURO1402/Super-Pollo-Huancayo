import { create } from 'zustand';
import { listarMovimientosServicio } from '../servicios/movientosStockServicio';

export const useStockStore = create((set, get) => ({
  entradas: [],
  totalEntradas: 0,
  paginaEntrada: 1,
  limitEntrada: 10,

  salidas: [],
  totalSalidas: 0,
  paginaSalida: 1,
  limitSalida: 10,

  cargando: false,
  error: null,

  cargarEntradas: async () => {
    const { paginaEntrada, limitEntrada } = get();
    const offset = (paginaEntrada - 1) * limitEntrada;

    set({ cargando: true, error: null });

    try {
      const respuesta = await listarMovimientosServicio({
        tipoMovimiento: 'entrada',
        limit: limitEntrada,
        offset,
      });

      set({
        entradas: respuesta.entradas || [],
        totalEntradas: respuesta.total || 0,
        cargando: false,
      });
    } catch (error) {
      set({ error: error.message, cargando: false });
    }
  },

  cargarSalidas: async () => {
    const { paginaSalida, limitSalida } = get();
    const offset = (paginaSalida - 1) * limitSalida;

    set({ cargando: true, error: null });

    try {
      const respuesta = await listarMovimientosServicio({
        tipoMovimiento: 'salida',
        limit: limitSalida,
        offset,
      });

      set({
        salidas: respuesta.entradas || [],
        totalSalidas: respuesta.total || 0,
        cargando: false,
      });
    } catch (error) {
      set({ error: error.message, cargando: false });
    }
  },

  setPaginaEntrada: (pagina) =>
    set({ paginaEntrada: pagina }),

  setLimitEntrada: (limit) =>
    set({ limitEntrada: limit, paginaEntrada: 1 }),

  setPaginaSalida: (pagina) =>
    set({ paginaSalida: pagina }),

  setLimitSalida: (limit) =>
    set({ limitSalida: limit, paginaSalida: 1 }),

  limpiarError: () => set({ error: null }),

  reset: () =>
    set({
      entradas: [],
      salidas: [],
      totalEntradas: 0,
      totalSalidas: 0,
      paginaEntrada: 1,
      limitEntrada: 10,
      paginaSalida: 1,
      limitSalida: 10,
      cargando: false,
      error: null,
    }),
}));