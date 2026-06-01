import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiUsers, FiShoppingCart } from "react-icons/fi";
import { MdTableBar, MdTableRestaurant } from "react-icons/md";
import {
  obtenerMesasConEstadoServicio,
  obtenerPedidoPorMesaServicio,
} from "../../servicios/pedidosServicio";
import { useVentaStore } from "../../store/useVentaStore";
import mostrarAlerta from "../../utilidades/toastUtilidades";
import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import MesaPedido from "../../componentes/panel-admin/ventas/MesaPedido";

const ETIQUETAS_ESTADO = {
  disponible: "Disponible",
  ocupado: "Ocupada",
  reservada: "Reservada",
  bloqueada: "Bloqueada",
};

const ahora = new Date();
const FECHA_HOY = ahora.toISOString().split("T")[0];
const HORA_AHORA = `${ahora.getHours().toString().padStart(2, "0")}:${ahora.getMinutes().toString().padStart(2, "0")}`;

const GestionPedidosPagina = () => {
  const navigate = useNavigate();
  const { agregarProducto, limpiarVenta } = useVentaStore();
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [cargandoPedido, setCargandoPedido] = useState(false);
  const [completandoPedido, setCompletandoPedido] = useState(false);
  const pollingRef = useRef(null);

  const modalPedido = useModal(false);

  const cargarMesas = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const data = await obtenerMesasConEstadoServicio(FECHA_HOY, HORA_AHORA);
      setMesas(data);
    } catch (error) {
      if (!silencioso) mostrarAlerta.error(error.message || "Error al cargar mesas");
    } finally {
      if (!silencioso) setCargando(false);
    }
  };

  useEffect(() => {
    cargarMesas();
    pollingRef.current = setInterval(() => cargarMesas(true), 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleVerPedido = async (mesaInfo) => {
    const mesaCompleta = mesas.find((m) => m.id_mesa === mesaInfo.id);

    if (!mesaCompleta) {
      mostrarAlerta.error("Mesa no encontrada");
      return;
    }

    setMesaSeleccionada(mesaCompleta);

    const tieneEstadoOcupada = mesaCompleta.estado_local === "ocupado";

    if (!tieneEstadoOcupada) {
      modalPedido.abrir();
      setPedidoActivo(null);
      return;
    }

    setCargandoPedido(true);
    modalPedido.abrir();

    try {
      const response = await obtenerPedidoPorMesaServicio(mesaCompleta.id_mesa);

      if (response?.pedido) {
        const pedido = response.pedido;

        if (pedido.estado_pedido === "completado") {
          mostrarAlerta.info("Este pedido ya fue completado anteriormente");
          setPedidoActivo(null);
          modalPedido.cerrar();
          await cargarMesas();
          return;
        }

        // ── Transformar solo con los datos disponibles del endpoint ──────
        const pedidoTransformado = {
          id_pedido: pedido.id_pedido,
          estado: pedido.estado_pedido,
          fecha_pedido: pedido.fecha_pedido,
          precio_precuenta: parseFloat(pedido.precio_precuenta ?? 0),
          productos: pedido.detalles.map((det) => ({
            id_detalle_pedido: det.id_detalle_pedido,
            id_producto: det.id_producto,
            nombre_producto: det.nombre_producto,
            cantidad: det.cantidad_pedido,
          })),
        };
        setPedidoActivo(pedidoTransformado);
      } else {
        setPedidoActivo(null);
        mostrarAlerta.info("No se encontró información del pedido para esta mesa");
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al obtener el pedido");
      setPedidoActivo(null);
    } finally {
      setCargandoPedido(false);
    }
  };

  const handleGenerarComprobante = async () => {
    if (!pedidoActivo?.productos?.length) {
      mostrarAlerta.warning("No hay productos para generar el comprobante");
      return;
    }

    setCompletandoPedido(true);

    try {
      limpiarVenta();
      await new Promise((resolve) => setTimeout(resolve, 50));

      for (const p of pedidoActivo.productos) {
        agregarProducto({
          id_producto: p.id_producto,
          nombre_producto: p.nombre_producto,
          cantidad: p.cantidad,
          id: p.id_producto,
          nombre: p.nombre_producto,
        });
      }

      modalPedido.cerrar();

      const pedidoId = pedidoActivo.id_pedido;
      const mesaId = mesaSeleccionada?.id_mesa;
      const numeroMesa = mesaSeleccionada?.numero_mesa;

      setPedidoActivo(null);
      setMesaSeleccionada(null);

      await cargarMesas();

      navigate("/admin/generar-venta", {
        state: {
          desdePedido: true,
          idPedido: pedidoId,
          idMesa: mesaId,
          numeroMesa: numeroMesa,
          // Lista con id_producto, nombre y cantidad para precargar el POS
          productosPedido: pedidoActivo.productos.map((p) => ({
            id_producto:     p.id_producto,
            nombre_producto: p.nombre_producto,
            cantidad:        p.cantidad,
          })),
        },
      });

      mostrarAlerta.exito("Productos cargados para venta");
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al completar el pedido");
    } finally {
      setCompletandoPedido(false);
    }
  };

  const estadoDisplay = (mesa) =>
    mesa.estado_local || mesa.estado_mesa || "disponible";

  const resumen = {
    total: mesas.length,
    disponible: mesas.filter((m) => estadoDisplay(m) === "disponible").length,
    ocupada: mesas.filter((m) =>
      ["ocupada", "ocupado"].includes(estadoDisplay(m))
    ).length,
    reservada: mesas.filter((m) => estadoDisplay(m) === "reservada").length,
    bloqueada: mesas.filter((m) => estadoDisplay(m) === "bloqueada").length,
  };

  const tienePedidoActivo =
    pedidoActivo !== null && pedidoActivo.estado !== "completado";

  const getBadgeColor = (estado) => {
    const colores = {
      disponible: "bg-emerald-500/20 text-emerald-300",
      ocupado: "bg-red-500/20 text-red-300",
      reservada: "bg-yellow-500/20 text-yellow-300",
      bloqueada: "bg-gray-500/20 text-gray-300",
    };
    return colores[estado] || colores.disponible;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MdTableRestaurant className="text-blue-500" />
              Estado de Mesas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Visualiza y gestiona las mesas del restaurante
            </p>
          </div>
          <button
            onClick={() => cargarMesas()}
            disabled={cargando}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${cargando ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {/* ── Resumen ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Disponibles", valor: resumen.disponible, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Ocupadas",    valor: resumen.ocupada,    color: "text-red-500",     bg: "bg-red-50 dark:bg-red-900/20" },
            { label: "Reservadas",  valor: resumen.reservada,  color: "text-yellow-500",  bg: "bg-yellow-50 dark:bg-yellow-900/20" },
            { label: "Total",       valor: resumen.total,      color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20" },
          ].map(({ label, valor, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
              <p className={`text-2xl font-bold ${color}`}>{valor}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Grid de mesas ── */}
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : mesas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MdTableBar className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm">No hay mesas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mesas.map((mesa) => {
              const estado = estadoDisplay(mesa);
              return (
                <MesaPedido
                  key={mesa.id_mesa}
                  id={mesa.id_mesa}
                  numero={mesa.numero_mesa}
                  capacidad={mesa.capacidad_mesa}
                  estado={estado}
                  tienePedidoActivo={estado === "ocupado"}
                  onClick={handleVerPedido}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal detalle pedido ── */}
      <Modal
        estaAbierto={modalPedido.estaAbierto}
        onCerrar={() => {
          modalPedido.cerrar();
          setPedidoActivo(null);
          setMesaSeleccionada(null);
        }}
        titulo={`Detalle de Mesa ${mesaSeleccionada?.numero_mesa || ""}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {mesaSeleccionada && (
          <div className="p-2">
            {/* Badge estado + capacidad */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(estadoDisplay(mesaSeleccionada))}`}>
                  {ETIQUETAS_ESTADO[estadoDisplay(mesaSeleccionada)] || estadoDisplay(mesaSeleccionada)}
                </span>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                  <FiUsers className="w-4 h-4" />
                  <span>Capacidad: {mesaSeleccionada.capacidad_mesa} personas</span>
                </div>
              </div>
            </div>

            {/* Skeleton mientras carga */}
            {cargandoPedido ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>

            ) : tienePedidoActivo ? (
              <>
                {/* Info del pedido */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    🍽️ Pedido #{pedidoActivo.id_pedido}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Fecha: {formatearFecha(pedidoActivo.fecha_pedido)} · Estado:{" "}
                    <span className="capitalize">{pedidoActivo.estado}</span>
                  </p>
                </div>

                {/* Lista de productos */}
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Productos del pedido
                </h4>
                <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
                  {pedidoActivo.productos.map((p, i) => (
                    <div
                      key={p.id_detalle_pedido ?? i}
                      className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700"
                    >
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                        {p.nombre_producto}
                      </p>
                      <span className="text-xs font-semibold text-white bg-blue-500 rounded-full px-2.5 py-0.5">
                        x{p.cantidad}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total precuenta */}
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700 mb-4">
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Total precuenta
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    S/ {pedidoActivo.precio_precuenta.toFixed(2)}
                  </span>
                </div>

                {/* Botón generar venta */}
                <button
                  onClick={handleGenerarComprobante}
                  disabled={completandoPedido}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {completandoPedido ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-4 h-4" />
                      Generar Venta
                    </>
                  )}
                </button>
              </>

            ) : (
              /* Mesa sin pedido activo */
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MdTableBar className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium text-center mb-2">
                  Mesa {ETIQUETAS_ESTADO[estadoDisplay(mesaSeleccionada)]?.toLowerCase() || "disponible"}
                </p>
                <p className="text-sm text-center">No hay pedidos activos en esta mesa</p>
                {estadoDisplay(mesaSeleccionada) === "disponible" && (
                  <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
                    Puedes crear un nuevo pedido desde la sección de ventas
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GestionPedidosPagina;