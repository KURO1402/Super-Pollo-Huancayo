import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  abrirCajaServicio,
  cerrarCajaServicio,
  registrarIngresoServicio,
  registrarEgresoServicio,
  registrarArqueoServicio,
  obtenerMovimientosPorCajaServicio,
  obtenerCajasCerradasServicio,
  obtenerCajaActualServicio
} from '../servicios/gestionCajaServicio';

export const useCajaStore = create(
  persist(
    (set, get) => ({
      cajaActual: {
        id_caja: null,
        estado: 'cerrada',
        saldoInicial: 0,
        saldoActual: 0,
        ingresos: 0,
        egresos: 0,
        fechaApertura: null,
        usuarioApertura: null
      },

      movimientos: [],
      totalMovimientos: 0,

      arqueos: [],

      cajasCerradas: [],
      totalCajasCerradas: 0,

      paginaActual: 1,
      limite: 10,

      filtros: {},

      cargando: false,
      rehidratando: false,
      error: null,

      abrirCaja: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const resp = await abrirCajaServicio(datos);
          const caja = resp.caja;

          const saldoInicial = Number(caja.saldo_inicial) || 0;

          set({
            cajaActual: {
              id_caja: caja.id_caja,
              estado: caja.estado_caja,
              saldoInicial,
              saldoActual: saldoInicial,
              ingresos: 0,
              egresos: 0,
              fechaApertura: caja.fecha_caja,
              usuarioApertura: caja.usuario || null
            },
            movimientos: [],
            totalMovimientos: 0,
            paginaActual: 1,
            cargando: false
          });

          return resp;
        } catch (err) {
          set({ error: err.message, cargando: false });
          throw err;
        }
      },

      cerrarCaja: async () => {
        set({ cargando: true, error: null });

        try {
          await cerrarCajaServicio();

          set({
            cajaActual: {
              id_caja: null,
              estado: 'cerrada',
              saldoInicial: 0,
              saldoActual: 0,
              ingresos: 0,
              egresos: 0,
              fechaApertura: null,
              usuarioApertura: null
            },
            movimientos: [],
            totalMovimientos: 0,
            paginaActual: 1,
            cargando: false
          });

        } catch (err) {
          set({ error: err.message, cargando: false });
          throw err;
        }
      },

      registrarIngreso: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const resp = await registrarIngresoServicio(datos);

          set((state) => {
            const monto = Number(datos.monto) || 0;
            const ingresos = state.cajaActual.ingresos + monto;

            return {
              cajaActual: {
                ...state.cajaActual,
                ingresos,
                saldoActual:
                  state.cajaActual.saldoInicial +
                  ingresos -
                  state.cajaActual.egresos
              },
              cargando: false
            };
          });

          get().cargarMovimientos();
          return resp;
        } catch (err) {
          set({ error: err.message, cargando: false });
          throw err;
        }
      },

      registrarEgreso: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const resp = await registrarEgresoServicio(datos);

          set((state) => {
            const monto = Number(datos.monto) || 0;
            const egresos = state.cajaActual.egresos + monto;

            return {
              cajaActual: {
                ...state.cajaActual,
                egresos,
                saldoActual:
                  state.cajaActual.saldoInicial +
                  state.cajaActual.ingresos -
                  egresos
              },
              cargando: false
            };
          });

          get().cargarMovimientos();
          return resp;
        } catch (err) {
          set({ error: err.message, cargando: false });
          throw err;
        }
      },

      registrarArqueo: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const resp = await registrarArqueoServicio(datos);

          set((state) => ({
            arqueos: [
              {
                id: resp.id || Date.now(),
                ...datos,
                fecha: new Date().toISOString()
              },
              ...state.arqueos
            ],
            cargando: false
          }));

          return resp;
        } catch (err) {
          set({ error: err.message, cargando: false });
          throw err;
        }
      },

      cargarMovimientos: async () => {
        const { paginaActual, limite, cajaActual } = get();
        if (!cajaActual.id_caja) return;

        const offset = (paginaActual - 1) * limite;

        set({ cargando: true, error: null });

        try {
          const resp = await obtenerMovimientosPorCajaServicio(
            cajaActual.id_caja,
            { limit: limite, offset }
          );

          set({
            movimientos: resp.movimientos || [],
            totalMovimientos: resp.cantidad_filas || 0,
            cargando: false
          });
        } catch (err) {
          set({ error: err.message, cargando: false });
        }
      },

      cargarCajasCerradas: async () => {
        const { paginaActual, limite } = get();
        const offset = (paginaActual - 1) * limite;

        set({ cargando: true, error: null });

        try {
          const resp = await obtenerCajasCerradasServicio({ limite, offset });

          set({
            cajasCerradas: resp.cajas || [],
            totalCajasCerradas: resp.total || 0,
            cargando: false
          });
        } catch (err) {
          set({ error: err.message, cargando: false });
        }
      },

      rehidratarCaja: async () => {
        const { cajaActual } = get();

        set({ rehidratando: true });

        set({ cargando: true, error: null });

        try {
          const caja = await obtenerCajaActualServicio();

          set({
            cajaActual: {
              id_caja: caja.id_caja,
              estado: caja.estado_caja,
              saldoInicial: Number(caja.saldo_inicial) || 0,
              saldoActual: Number(caja.saldo_actual) || 0,
              ingresos: Number(caja.total_ingresos) || 0,
              egresos: Number(caja.total_egresos) || 0,
              fechaApertura: caja.fecha_caja,
              usuarioApertura: caja.usuario || null
            },
            cargando: false,
            rehidratando: false
          });

          get().cargarMovimientos();

        } catch (err) {
          set({
            cajaActual: {
              id_caja: null,
              estado: 'cerrada',
              saldoInicial: 0,
              saldoActual: 0,
              ingresos: 0,
              egresos: 0,
              fechaApertura: null,
              usuarioApertura: null
            },
            movimientos: [],
            totalMovimientos: 0,
            cargando: false,
            rehidratando: false,
            error: null
          });
        }
      },

      setFiltros: (nuevosFiltros) => {
        set({ filtros: nuevosFiltros, paginaActual: 1 });
        get().cargarMovimientos();
      },

      limpiarFiltros: () => {
        set({ filtros: {}, paginaActual: 1 });
        get().cargarMovimientos();
      },

      setPagina: (pagina) => {
        set({ paginaActual: pagina });
        get().cargarMovimientos();
      },

      setLimite: (nuevoLimite) => {
        set({ limite: nuevoLimite, paginaActual: 1 });
        get().cargarMovimientos();
      },

      limpiarError: () => set({ error: null }),

      reset: () =>
        set({
          cajaActual: {
            id_caja: null,
            estado: 'cerrada',
            saldoInicial: 0,
            saldoActual: 0,
            ingresos: 0,
            egresos: 0,
            fechaApertura: null,
            usuarioApertura: null
          },
          movimientos: [],
          totalMovimientos: 0,
          arqueos: [],
          cajasCerradas: [],
          totalCajasCerradas: 0,
          paginaActual: 1,
          limite: 10,
          filtros: {},
          cargando: false,
          rehidratando: false,
          error: null
        })
    }),
    {
      name: 'caja-minima',
      partialize: (state) => ({
        cajaActual: {
          id_caja: state.cajaActual.id_caja,
          estado: state.cajaActual.estado,
          saldoInicial: state.cajaActual.saldoInicial,
          saldoActual: state.cajaActual.saldoActual,
          ingresos: state.cajaActual.ingresos,
          egresos: state.cajaActual.egresos,
          fechaApertura: state.cajaActual.fechaApertura,
          usuarioApertura: state.cajaActual.usuarioApertura
        }
      })
    }
  )
);