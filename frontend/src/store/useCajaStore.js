import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCajaStore = create(
  persist( 
    (set, get) => ({
      caja: {
        idCaja: null,
        estado: "cerrada",
        saldoInicial: 0,
        saldoActual: 0,
        ingresos: 0,
        egresos: 0,
        movimientos: []
      },
      loading: false,
      error: null,
      calcularTotales: (movimientos) => {
        let ingresos = 0;
        let egresos = 0;
        
        movimientos.forEach(movimiento => {
          if (movimiento.tipoMovimiento === 'Ingreso') {
            ingresos += parseFloat(movimiento.montoMovimiento) || 0;
          } else if (movimiento.tipoMovimiento === 'Egreso') {
            egresos += parseFloat(movimiento.montoMovimiento) || 0;
          }
        });

        return { ingresos, egresos };
      },

      setCaja: (cajaData) => set({ 
        caja: { ...get().caja, ...cajaData },
        error: null 
      }),

      setCajaCompleta: (cajaData) => {
        const { ingresos, egresos } = get().calcularTotales(cajaData.movimientos || []);
        
        const cajaCompleta = {
          ...cajaData,
          ingresos,
          egresos,
          saldoActual: (cajaData.saldoInicial || 0) + ingresos - egresos
        }; 

        set({ 
          caja: cajaCompleta,
          error: null 
        });
      },

      setMovimientos: (movimientos) => {
        const state = get();
        const { ingresos, egresos } = get().calcularTotales(movimientos);
        
        set({
          caja: { 
            ...state.caja, 
            movimientos,
            ingresos,
            egresos,
            saldoActual: (state.caja.saldoInicial || 0) + ingresos - egresos
          }
        });
      },

      agregarMovimiento: (nuevoMovimiento) => {
        const state = get();
        const movimientosActualizados = [nuevoMovimiento, ...state.caja.movimientos];
        
        let nuevosIngresos = state.caja.ingresos;
        let nuevosEgresos = state.caja.egresos;

        if (nuevoMovimiento.tipoMovimiento === 'ingreso') {
          nuevosIngresos += parseFloat(nuevoMovimiento.monto) || 0;
        } else if (nuevoMovimiento.tipoMovimiento === 'egreso') {
          nuevosEgresos += parseFloat(nuevoMovimiento.monto) || 0;
        }

        const nuevoSaldoActual = state.caja.saldoInicial + nuevosIngresos - nuevosEgresos;

        set({
          caja: {
            ...state.caja,
            movimientos: movimientosActualizados,
            ingresos: nuevosIngresos,
            egresos: nuevosEgresos,
            saldoActual: nuevoSaldoActual
          },
          error: null
        });
      },
      abrirCaja: (cajaData) => set({ 
        caja: {
          idCaja: cajaData.idCaja,      
          estado: "abierta",
          saldoInicial: parseFloat(cajaData.saldoInicial) || 0,
          saldoActual: parseFloat(cajaData.saldoActual) || 0,
          ingresos: 0,  
          egresos: 0,
          movimientos: []
        }
      }),

      cerrarCaja: () => set({
        caja: {
          idCaja: null,
          estado: "cerrada",
          saldoInicial: 0,
          saldoActual: 0,
          ingresos: 0,
          egresos: 0,
          movimientos: []
        }
      }),

      setLoading: (isLoading) => set({ loading: isLoading }),

      setError: (errorMessage) => set({ error: errorMessage }),

      limpiarError: () => set({ error: null }),

      getEstado: () => {
        const state = get();
        return state;
      }
    }),
    {
      name: 'caja-storage',
      partialize: (state) => ({
        caja: state.caja
      })
    }
  )
);