import { create } from 'zustand';
import { actualizarRolUsuarioServicio, eliminarUsuarioServicio, obtenerUsuariosServicio } from '../servicios/usuariosServicios';

export const useUsuariosStore = create((set, get) => ({
    usuarios: [],
    total: 0,
    cargando: false,
    error: null,
    paginaActual: 1,
    limite: 10,
    filtros: {
        busqueda: '',
        rol: '',
    },

    cargarUsuarios: async () => {
        const { paginaActual, limite, filtros } = get();
        const offset = (paginaActual - 1) * limite;

        set({ cargando: true, error: null });
        try {
            const data = await obtenerUsuariosServicio({ limite, offset, filtros });
            set({ usuarios: data.usuarios, total: data.total, cargando: false, error: null });
        } catch (error) {
            set({ error: error.message, cargando: false });
        }
    },

    actualizarRol: async (id_usuario, id_rol) => {
        try {
            await actualizarRolUsuarioServicio(id_usuario, id_rol);
            await get().cargarUsuarios();
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    eliminarUsuario: async (id_usuario) => {
        try {
            await eliminarUsuarioServicio(id_usuario);
            set((state) => ({
                usuarios: state.usuarios.filter((u) => u.id_usuario !== id_usuario),
            }));
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    setPagina: (pagina) => {
        set({ paginaActual: pagina });
        get().cargarUsuarios();
    },

    setLimite: (nuevoLimite) => {
        set({ limite: nuevoLimite, paginaActual: 1});
        get().cargarUsuarios();
    },

    setFiltros: (nuevosFiltros) => {
        set((state) => ({
            filtros: { ...state.filtros, ...nuevosFiltros },
            paginaActual: 1,
        }));
        get().cargarUsuarios();
    },

    limpiarFiltros: () => {
        set({ filtros: { busqueda: '', rol: '' }, paginaActual: 1 });  
        get().cargarUsuarios();
    },

    limpiarError: () => set({ error: null }),
    reset: () =>
        set({
        usuarios: [], total: 0, cargando: false, error: null,
        paginaActual: 1, limite: 10,
        filtros: { busqueda: '', rol: '' },
    }),
}));