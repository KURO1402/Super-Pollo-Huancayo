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
      rehidratando: false, // ✅ NUEVO FLAG
      error: null,

      // ABRIR CAJA
      abrirCaja: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const resp = await abrirCajaServicio(datos);
          const caja = resp.caja;

          const saldoInicial = Number(caja.saldo_inicial) || 0;

          set({
            cajaActual: {
              id_caja: caja.id_caja,
              estado: 'abierta',
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

      // CERRAR CAJA
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

      // REGISTRAR INGRESO
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

      // REGISTRAR EGRESO
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

      // REGISTRAR ARQUEO
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

      // CARGAR MOVIMIENTOS
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

      // CARGAR CAJAS CERRADAS
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

      // reconstruir saldos reales al refrescar la página
      rehidratarCaja: async () => {
        const { cajaActual } = get();

        // ✅ Siempre activar rehidratando para bloquear la UI
        set({ rehidratando: true });

        // Si no hay caja que verificar, liberar inmediatamente
        if (!cajaActual.id_caja || cajaActual.estado !== 'abierta') {
          set({ rehidratando: false });
          return;
        }

        set({ cargando: true, error: null });

        try {
          const caja = await obtenerCajaActualServicio();

          set({
            cajaActual: {
              id_caja: caja.id_caja,
              estado: 'abierta',
              saldoInicial: Number(caja.saldo_inicial) || 0,
              saldoActual: Number(caja.saldo_actual) || 0,
              ingresos: Number(caja.total_ingresos) || 0,
              egresos: Number(caja.total_egresos) || 0,
              fechaApertura: caja.fecha_caja,
              usuarioApertura: caja.usuario || null
            },
            cargando: false,
            rehidratando: false //
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
            rehidratando: false, //
            error: null
          });
        }
      },

      // FILTROS
      setFiltros: (nuevosFiltros) => {
        set({ filtros: nuevosFiltros, paginaActual: 1 });
        get().cargarMovimientos();
      },

      limpiarFiltros: () => {
        set({ filtros: {}, paginaActual: 1 });
        get().cargarMovimientos();
      },

      // PAGINACIÓN
      setPagina: (pagina) => {
        set({ paginaActual: pagina });
        get().cargarMovimientos();
      },

      setLimite: (nuevoLimite) => {
        set({ limite: nuevoLimite, paginaActual: 1 });
        get().cargarMovimientos();
      },

      // UTILIDADES
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