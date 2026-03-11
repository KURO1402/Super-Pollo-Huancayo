import { FiShoppingCart, FiUser, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import {
  generarVentaServicio,
  obtenerMetodosPagoServicio,
  obtenerTiposComprobanteServicio,
} from "../../servicios/ventasServicio";
import { obtenerProductosServicio } from "../../servicios/productoServicios";
import { useVentaStore } from "../../store/useVentaStore";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import { useBusqueda } from "../../hooks/useBusqueda";
import { TarjetaProducto } from "../../componentes/panel-admin/ventas/TarjetaProducto";
import { DetalleVenta } from "../../componentes/panel-admin/ventas/DetalleVenta";
import { ResumenVenta } from "../../componentes/panel-admin/ventas/ResumenVenta";
import { FormularioCliente } from "../../componentes/panel-admin/ventas/FormularioCliente";
import { ModalComprobanteGenerado } from "../../componentes/panel-admin/ventas/ModalComprobanteGenerado";
import mostrarAlerta from "../../utilidades/toastUtilidades";

// id_tipo_comprobante: 1=Boleta, 2=Factura, 3=Nota de Venta (según tu BD)
// soloRuc y requiereCliente se derivan del id
const esFactura = (id) => id === 2;
const esNotaVenta = (id) => id === 3;

const GenerarVentaPagina = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } =
    useBusqueda();
  const { detalle, limpiarVenta } = useVentaStore();
  const { estaAbierto, abrir, cerrar } = useModal();
  const {
    confirmacionVisible,
    mensajeConfirmacion,
    tituloConfirmacion,
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion,
  } = useConfirmacion();

  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [cargandoTipos, setCargandoTipos] = useState(true);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [cargandoMetodoPago, setCargandoMetodoPago] = useState(true);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [datosCliente, setDatosCliente] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalComprobante, setMostrarModalComprobante] = useState(false);
  const [datosComprobante, setDatosComprobante] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // ── Cargar tipos de comprobante ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setCargandoTipos(true);
        const resp = await obtenerTiposComprobanteServicio();
        setTiposComprobante(resp);
        if (resp.length > 0) setTipoSeleccionado(resp[0]);
      } catch {
        mostrarAlerta.error("Error al cargar tipos de comprobante");
      } finally {
        setCargandoTipos(false);
      }
    })();
  }, []);

  // ── Cargar productos ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setCargandoProductos(true);
        const resp = await obtenerProductosServicio();
        setProductos(resp.productos || resp || []);
      } catch {
        setProductos([]);
      } finally {
        setCargandoProductos(false);
      }
    })();
  }, []);

  // ── Cargar métodos de pago ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setCargandoMetodoPago(true);
        const resp = await obtenerMetodosPagoServicio();
        if (resp?.length > 0) {
          setMetodosPago(resp);
          setMetodoPagoSeleccionado(resp[0].id_medio_pago.toString());
        }
      } catch {
        setMetodosPago([]);
      } finally {
        setCargandoMetodoPago(false);
      }
    })();
  }, []);

  // ── Cambio de tipo de comprobante ─────────────────────────────────────────
  const handleTipoComprobante = (tipo) => {
    setTipoSeleccionado(tipo);
    // Si cambia a factura y el cliente no tiene RUC, limpiarlo
    if (
      esFactura(tipo.id_tipo_comprobante) &&
      datosCliente &&
      datosCliente.tipoDocumento !== "2"
    ) {
      setDatosCliente(null);
      mostrarAlerta.advertencia("Para factura se requiere cliente con RUC");
    }
    // Si cambia desde factura, limpiar cliente
    if (!esFactura(tipo.id_tipo_comprobante) && datosCliente) {
      setDatosCliente(null);
    }
  };

  // ── Guardar cliente desde modal ───────────────────────────────────────────
  const handleClienteGuardado = (cliente) => {
    const idTipo = tipoSeleccionado?.id_tipo_comprobante;
    if (esFactura(idTipo)) {
      if (cliente.tipoDocumento !== "2") {
        mostrarAlerta.error("Para factura solo se acepta RUC");
        return;
      }
      if (cliente.numeroDocumento?.length !== 11) {
        mostrarAlerta.error("El RUC debe tener 11 dígitos");
        return;
      }
      if (!cliente.direccion?.trim()) {
        mostrarAlerta.error("La dirección es obligatoria para factura");
        return;
      }
    } else {
      if (cliente.tipoDocumento === "2") {
        mostrarAlerta.error("Para boleta o nota de venta use DNI");
        return;
      }
      if (cliente.numeroDocumento?.length !== 8) {
        mostrarAlerta.error("El DNI debe tener 8 dígitos");
        return;
      }
    }
    setDatosCliente(cliente);
    cerrar();
    mostrarAlerta.exito("Cliente agregado");
  };

  // ── Quitar cliente ────────────────────────────────────────────────────────
  const handleEliminarCliente = () => {
    solicitarConfirmacion(
      "¿Desea quitar el cliente de esta venta?",
      () => {
        setDatosCliente(null);
        mostrarAlerta.exito("Cliente quitado");
      },
      { titulo: "Quitar cliente" },
    );
  };

  // ── Limpiar venta ─────────────────────────────────────────────────────────
  const handleLimpiarVenta = () => {
    if (detalle.length > 0 || datosCliente) {
      solicitarConfirmacion(
        "¿Estás seguro de limpiar toda la venta?",
        () => {
          limpiarVenta();
          setDatosCliente(null);
          mostrarAlerta.exito("Venta limpiada");
        },
        { titulo: "Limpiar venta" },
      );
    }
  };

  // ── Generar comprobante ───────────────────────────────────────────────────
  const handleGenerarComprobante = async () => {
    if (detalle.length === 0) {
      mostrarAlerta.advertencia("Debe agregar al menos un producto");
      return;
    }
    const idTipo = tipoSeleccionado?.id_tipo_comprobante;
    if (esFactura(idTipo) && !datosCliente) {
      mostrarAlerta.advertencia(
        "Para factura debe seleccionar un cliente con RUC",
      );
      return;
    }
    if (!metodoPagoSeleccionado) {
      mostrarAlerta.advertencia("Debe seleccionar un método de pago");
      return;
    }

    setCargando(true);
    try {
      let clientePayload;
      if (esFactura(idTipo) && datosCliente) {
        clientePayload = {
          idTipoDoc: 2,
          numDoc: Number(datosCliente.numeroDocumento),
          denominacionCliente: datosCliente.nombre,
          direccionCliente: datosCliente.direccion?.trim() || "",
        };
      } else if (datosCliente) {
        clientePayload = {
          idTipoDoc: 1,
          numDoc: Number(datosCliente.numeroDocumento),
          denominacionCliente: datosCliente.nombre,
        };
      } else {
        clientePayload = {
          idTipoDoc: 1,
          numDoc: 10000000,
          denominacionCliente: "Clientes Varios",
        };
      }

      const ventaData = {
        tipoComprobante: Number(idTipo),
        medioPago: Number(metodoPagoSeleccionado),
        cliente: clientePayload,
        productos: detalle.map((item) => ({
          idProducto: item.id_producto || item.idProducto || item.id,
          cantidad: item.cantidad,
        })),
      };

      const respuesta = await generarVentaServicio(ventaData);

      if (respuesta?.ok) {
        setDatosComprobante({
          ...respuesta,
          tipoComprobante: idTipo,
          tipoComprobanteTexto:
            tipoSeleccionado?.nombre_tipo_comprobante || "Comprobante",
        });
        setMostrarModalComprobante(true);
        limpiarVenta();
        setDatosCliente(null);
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al generar el comprobante");
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarModalComprobante = () => {
    setMostrarModalComprobante(false);
    setDatosComprobante(null);
  };

  const handleDescargarPDF = () => {
    if (datosComprobante?.urlPdf)
      window.open(datosComprobante.urlPdf, "_blank");
  };

  // ── Helpers UI ────────────────────────────────────────────────────────────
  const idTipoActual = tipoSeleccionado?.id_tipo_comprobante;
  const filtrados = filtrarPorBusqueda(productos, [
    "nombre_producto",
    "descripcion_producto",
  ]);
  const labelCliente = esFactura(idTipoActual)
    ? "Cliente (RUC requerido)"
    : "Cliente (opcional)";
  const placeholderCliente = esFactura(idTipoActual)
    ? "Seleccione un cliente con RUC"
    : "Clientes Varios";

  return (
    <div className="p-2">
      {/* Título */}
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Punto de Venta
        </h1>
        <FiShoppingCart className="text-2xl text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel izquierdo: productos */}
        <div className="lg:col-span-1">
          <div className="mb-3">
            <BarraBusqueda
              valor={terminoBusqueda}
              onChange={setTerminoBusqueda}
              placeholder="Buscar producto..."
            />
          </div>
          {cargandoProductos ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-gray-500 text-sm">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {filtrados.map((producto) => (
                <TarjetaProducto
                  key={producto.id_producto}
                  producto={producto}
                />
              ))}
            </div>
          )}
        </div>

        {/* Panel derecho: formulario */}
        <div className="col-span-3 space-y-4">
          {/* Tabs tipo comprobante */}
          {cargandoTipos ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-0">
              <div className="flex">
                {tiposComprobante.map((tipo) => (
                  <button
                    key={tipo.id_tipo_comprobante}
                    onClick={() => handleTipoComprobante(tipo)}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
                      tipoSeleccionado?.id_tipo_comprobante ===
                      tipo.id_tipo_comprobante
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {tipo.nombre_tipo_comprobante.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Serie solo lectura */}
              <input
                readOnly
                value={tipoSeleccionado?.serie || ""}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm w-28 cursor-default"
              />
            </div>
          )}

          {/* Nota Factura */}
          {esFactura(idTipoActual) && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-800 dark:text-amber-300">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>
                La factura requiere un cliente con{" "}
                <strong>RUC de 11 dígitos</strong> y dirección fiscal.
              </span>
            </div>
          )}

          {/* Nota Nota de Venta */}
          {esNotaVenta(idTipoActual) && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-300">
              <span className="shrink-0 mt-0.5">ℹ️</span>
              <span>
                La nota de venta <strong>no se envía a SUNAT</strong> y no es
                válida para crédito fiscal.
              </span>
            </div>
          )}

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {labelCliente}
              {esFactura(idTipoActual) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {datosCliente ? (
              <div className="flex items-center gap-2 p-3 border border-green-300 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/20">
                <FiCheck
                  className="text-green-600 dark:text-green-400 shrink-0"
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {datosCliente.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {datosCliente.tipoDocumento === "2" ? "RUC" : "DNI"}:{" "}
                    {datosCliente.numeroDocumento}
                    {datosCliente.direccion && ` • ${datosCliente.direccion}`}
                  </p>
                </div>
                <button
                  onClick={abrir}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                  title="Editar cliente"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={handleEliminarCliente}
                  className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Quitar cliente"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <FiUser className="text-gray-400 shrink-0" />
                  <span className="text-gray-500 text-sm truncate">
                    {placeholderCliente}
                  </span>
                </div>
                <button
                  onClick={abrir}
                  className="w-20 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Agregar cliente"
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Método de Pago <span className="text-red-500">*</span>
            </label>
            {cargandoMetodoPago ? (
              <div className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm">
                Cargando...
              </div>
            ) : (
              <select
                value={metodoPagoSeleccionado}
                onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Seleccione método
                </option>
                {metodosPago.map((m) => (
                  <option key={m.id_medio_pago} value={m.id_medio_pago}>
                    {m.nombre_medio_pago.charAt(0).toUpperCase() + m.nombre_medio_pago.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Detalle y resumen */}
          <DetalleVenta />
          <ResumenVenta />

          {/* Botones acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleLimpiarVenta}
              disabled={detalle.length === 0 && !datosCliente}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Limpiar Todo
            </button>
            <button
              onClick={handleGenerarComprobante}
              disabled={
                detalle.length === 0 ||
                cargando ||
                (esFactura(idTipoActual) && !datosCliente) ||
                !metodoPagoSeleccionado
              }
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </>
              ) : (
                `Generar ${tipoSeleccionado?.nombre_tipo_comprobante || "Comprobante"}`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal agregar/editar cliente */}
      {estaAbierto && (
        <Modal
          estaAbierto={estaAbierto}
          onCerrar={cerrar}
          titulo={datosCliente ? "Editar Cliente" : "Agregar Cliente"}
          tamaño="xl"
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <FormularioCliente
            onSubmit={handleClienteGuardado}
            onCancelar={cerrar}
            tipoComprobante={idTipoActual}
            soloRuc={esFactura(idTipoActual)}
          />
        </Modal>
      )}

      {/* Modal comprobante generado */}
      <ModalComprobanteGenerado
        estaAbierto={mostrarModalComprobante}
        onCerrar={handleCerrarModalComprobante}
        datosComprobante={datosComprobante}
        onDescargarPDF={handleDescargarPDF}
      />

      {/* Modal confirmación genérico */}
      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
        tipo="peligro"
      />
    </div>
  );
};

export default GenerarVentaPagina;
