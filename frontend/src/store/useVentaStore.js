import { create } from "zustand";
import {
  obtenerVentasServicio,
  obtenerDetalleVentaServicio,
  obtenerComprobanteServicio,
} from "../servicios/ventasServicio";

export const useVentaStore = create((set, get) => ({
  detalle: [],
  cantidades: {},
  porcentajeIGV: 18,
  TASA_IGV: 1.18,

  ventas: [],
  total: 0,
  cargando: false,
  error: null,
  paginaActual: 1,
  limit: 10,

  detalleVenta: [],
  comprobante: null,
  cargandoDetalle: false,
  cargandoComprobante: false,

  cargarVentas: async ({ fechaInicio, fechaFin } = {}) => {
    const { paginaActual, limit } = get();
    const offset = (paginaActual - 1) * limit;

    set({ cargando: true, error: null });
    try {
      const respuesta = await obtenerVentasServicio({
        limit,
        offset,
        fechaInicio,
        fechaFin,
      });
      set({
        ventas: respuesta.ventas || [],
        total: respuesta.cantidad_filas || 0,
        cargando: false,
      });
    } catch (error) {
      if (error.message?.includes("No se encontraron")) {
        set({ ventas: [], total: 0, cargando: false });
      } else {
        set({ error: error.message, cargando: false });
      }
    }
  },

  obtenerDetalleVenta: async (idVenta) => {
    set({ cargandoDetalle: true, error: null });
    try {
      const detalleVenta = await obtenerDetalleVentaServicio(idVenta);
      set({ detalleVenta: detalleVenta, cargandoDetalle: false });
    } catch (error) {
      set({ error: error.message, cargandoDetalle: false });
    }
  },

  obtenerComprobante: async (idVenta) => {
    set({ cargandoComprobante: true, error: null });
    try {
      const comprobante = await obtenerComprobanteServicio(idVenta);
      set({ comprobante, cargandoComprobante: false });
      return comprobante;
    } catch (error) {
      set({ error: error.message, cargandoComprobante: false });
      throw error;
    }
  },

  descargarComprobantePDF: async (idVenta) => {
    try {
      const comprobante = await get().obtenerComprobante(idVenta);

      if (!comprobante?.url_comprobante_pdf) {
        throw new Error("No existe URL del comprobante PDF");
      }
      window.open(comprobante.url_comprobante_pdf, "_blank");
    } catch (error) {
      set({ error: error.message });
    }
  },

  setPagina: (pagina) => {
    set({ paginaActual: pagina });
    get().cargarVentas();
  },

  setLimite: (nuevoLimite) => {
    set({ limit: nuevoLimite, paginaActual: 1 });
    get().cargarVentas();
  },

  limpiarError: () => set({ error: null }),

  reset: () =>
    set({
      ventas: [],
      total: 0,
      cargando: false,
      error: null,
      paginaActual: 1,
      limit: 10,
    }),

  obtenerId: (producto) => {
    return producto.id_producto || producto.id;
  },

  limpiarComprobante: () => set({ comprobante: null }),

  limpiarDetalleVenta: () => set({ detalleVenta: [] }),

  setCantidad: (id, cantidad) =>
    set((state) => ({
      cantidades: {
        ...state.cantidades,
        [id]: cantidad,
      },
    })),

  actualizarCantidad: (id, nuevaCantidad) =>
    set((state) => ({
      detalle: state.detalle.map((item) => {
        const itemId = item.id_producto || item.id;
        return itemId === id ? { ...item, cantidad: nuevaCantidad } : item;
      }),
    })),

  agregarProducto: (producto) => {
    const { detalle, cantidades, obtenerId } = get();
    const productoId = obtenerId(producto);
    const cantidad = cantidades[productoId] || 1;
    const productoExistente = detalle.find((item) => {
      const itemId = item.id_producto || item.id;
      return itemId === productoId;
    });

    if (productoExistente) {
      set({
        detalle: detalle.map((item) => {
          const itemId = item.id_producto || item.id;
          return itemId === productoId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item;
        }),
      });
    } else {
      const nuevoProducto = {
        ...producto,
        idProducto: productoId,
        id: productoId,
        cantidad: cantidad,
        nombre: producto.nombre_producto,
        precio: Number(producto.precio_producto),
        categoria: producto.nombre_categoria,
        descripcion: producto.descripcion_producto,
        usaInsumos: producto.usa_insumos,
      };
      set({ detalle: [...detalle, nuevoProducto] });
    }
    set({ cantidades: { ...cantidades, [productoId]: 0 } });
  },

  removerProducto: (id) =>
    set((state) => ({
      detalle: state.detalle.filter((item) => {
        const itemId = item.id_producto || item.id;
        return itemId !== id;
      }),
    })),

  limpiarVenta: () =>
    set({
      detalle: [],
      cantidades: {},
    }),

  calcularMontosProducto: (producto, cantidad) => {
    const precioConIGV = Number(producto.precio_producto);
    const valorUnitario = precioConIGV / get().TASA_IGV;

    const subtotal = valorUnitario * cantidad;
    const total = precioConIGV * cantidad;
    const igv = total - subtotal;

    return {
      valor_unitario: Number(valorUnitario.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  },

  subtotal: () => {
    const { detalle, TASA_IGV } = get();
    const totalConIGV = detalle.reduce(
      (acumulador, item) =>
        acumulador +
        Number(item.precio_producto || item.precio) * item.cantidad,
      0,
    );

    const baseImponible = totalConIGV / TASA_IGV;
    return Number(baseImponible.toFixed(2));
  },

  impuesto: () => {
    const { detalle, TASA_IGV } = get();
    const totalConIGV = detalle.reduce(
      (acumulador, item) =>
        acumulador +
        Number(item.precio_producto || item.precio) * item.cantidad,
      0,
    );

    const baseImponible = totalConIGV / TASA_IGV;
    const igv = totalConIGV - baseImponible;
    return Number(igv.toFixed(2));
  },

  totalVenta: () => {
    const { detalle } = get();
    return Number(
      detalle
        .reduce(
          (acumulador, item) =>
            acumulador +
            Number(item.precio_producto || item.precio) * item.cantidad,
          0,
        )
        .toFixed(2),
    );
  },

  calcularMontosTotales: () => {
    const { detalle, porcentajeIGV } = get();

    const montoTotal = detalle.reduce(
      (suma, producto) =>
        suma +
        Number(producto.precio_producto || producto.precio) *
          (producto.cantidad || 0),
      0,
    );

    const totalGravada = Number(
      (montoTotal / (1 + porcentajeIGV / 100)).toFixed(2),
    );
    const totalIGV = Number((montoTotal - totalGravada).toFixed(2));

    return {
      totalGravada,
      totalIGV,
      porcentajeIGV,
      total: Number(montoTotal.toFixed(2)),
    };
  },
}));