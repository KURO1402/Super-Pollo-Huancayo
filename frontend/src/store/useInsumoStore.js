import { create } from 'zustand';
import { listarInsumoServicio, eliminarInsumoServicio } from '../servicios/insumosServicios';

export const useInsumosStore = create((set, get) => ({
    insumos: [],
    total: 0,
    cargando: false,
    error: null,
    paginaActual: 1,
    limit: 10,

    cargarInsumos: async () => {
        const { paginaActual, limit } = get();
        const offset = (paginaActual - 1) * limit;

        set({ cargando: true, error: null });
        try {
            const respuesta = await listarInsumoServicio({ limit, offset });
            
            set({ 
                insumos: respuesta.insumos || [], 
                total: respuesta.cantidad_filas || 0,
                cargando: false 
            });
        } catch (error) {
            set({ error: error.message, cargando: false });
        }
    },

    eliminarInsumo: async (idInsumo) => {
        try {
            await eliminarInsumoServicio(idInsumo);
            await get().cargarInsumos();
        } catch (error) {
            throw error;
        }
    },

    setPagina: (pagina) => {
        set({ paginaActual: pagina });
    },

    setLimite: (nuevoLimite) => {
        set({ limit: nuevoLimite, paginaActual: 1 });
    },

    limpiarError: () => set({ error: null }),

    reset: () =>
        set({
            insumos: [],
            total: 0,
            cargando: false,
            error: null,
            paginaActual: 1,
            limit: 10,
        }),
}));