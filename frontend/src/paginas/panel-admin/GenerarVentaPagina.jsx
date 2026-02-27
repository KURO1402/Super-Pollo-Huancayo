import { FiShoppingCart, FiUser, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { generarVentaServicio, obtenerMetodosPagoServicio } from '../../servicios/ventasServicio';
import { obtenerProductosServicio } from "../../servicios/productoServicios";
import { useVentaStore } from '../../store/useVentaStore';
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import { useBusqueda } from "../../hooks/useBusqueda";
import {TarjetaProducto} from "../../componentes/panel-admin/ventas/TarjetaProducto";
import { DetalleVenta } from "../../componentes/panel-admin/ventas/DetalleVenta";
import { ResumenVenta } from "../../componentes/panel-admin/ventas/ResumenVenta";
import { FormularioCliente } from "../../componentes/panel-admin/ventas/FormularioCliente";
import { ModalComprobanteGenerado } from "../../componentes/panel-admin/ventas/ModalComprobanteGenerado";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const GenerarVentaPagina = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { detalle, limpiarVenta } = useVentaStore();
  const { estaAbierto, abrir, cerrar } = useModal();
  const { confirmacionVisible, mensajeConfirmacion, tituloConfirmacion, solicitarConfirmacion, ocultarConfirmacion, confirmarAccion} = useConfirmacion();
  
  const [tipoComprobante, setTipoComprobante] = useState(1);
  const [cargandoMetodoPago, setCargandoMetodoPago] = useState(true);
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [datosCliente, setDatosCliente] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalComprobante, setMostrarModalComprobante] = useState(false);
  const [datosComprobante, setDatosComprobante] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargandoProductos(true);
        const respuesta = await obtenerProductosServicio();
        const productosData = respuesta.productos || respuesta || [];
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]);
      } finally {
        setCargandoProductos(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    const cargarMetodosPago = async () => {
      try {
        setCargandoMetodoPago(true);
        const respuesta = await obtenerMetodosPagoServicio();
        
        if (respuesta && respuesta.length > 0) {
          setMetodosPago(respuesta);
          setMetodoPagoSeleccionado(respuesta[0].id_medio_pago.toString());
        } else {
          setMetodosPago([]);
          setMetodoPagoSeleccionado("");
        }
      } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        setMetodosPago([]);
        setMetodoPagoSeleccionado("");
      } finally {
        setCargandoMetodoPago(false);
      }
    };

    cargarMetodosPago();
  }, []);

  const handleTipoComprobante = (tipo) => {
    setTipoComprobante(tipo);
    if (tipo === 2 && datosCliente && datosCliente.tipoDocumento !== "2") {
      setDatosCliente(null);
    }
    if (tipo === 1 && datosCliente && datosCliente.tipoDocumento !== "1") {
      setDatosCliente(null);
    }
  };

  const handleAbrirModalCliente = () => {
    abrir();
  };

  const handleCerrarModalCliente = () => {
    cerrar();
  };

  const handleClienteGuardado = (cliente) => {
    if (tipoComprobante === 2) {
      if (cliente.tipoDocumento !== "2") {
        mostrarAlerta.error("Para factura se requiere RUC");
        return;
      }
      if (cliente.numeroDocumento.length !== 11) {
        mostrarAlerta.error("El RUC debe tener 11 dígitos");
        return;
      }
      if (!cliente.direccion || cliente.direccion.trim() === "") {
        mostrarAlerta.error("La dirección es obligatoria para factura");
        return;
      }
    } else { 
      if (cliente.tipoDocumento !== "1") {
        mostrarAlerta.error("Para boleta se requiere DNI");
        return;
      }
      if (cliente.numeroDocumento.length !== 8) {
        mostrarAlerta.error("El DNI debe tener 8 dígitos");
        return;
      }
    }
    
    mostrarAlerta.exito("Cliente agregado a la venta");
    setDatosCliente(cliente);
    cerrar();
  };

  const handleEliminarCliente = () => {
    solicitarConfirmacion(
      "¿Desea quitar el cliente de esta venta?",
      () => {
        setDatosCliente(null);
        mostrarAlerta.exito("Cliente quitado de la venta");
      },
      "Quitar cliente"
    );
  };

  const calcularTotales = () => {
    const subtotal = detalle.reduce((acc, item) => {
      const precio = item.precio_unitario || item.precioProducto || item.precio || 0;
      return acc + (precio * item.cantidad);
    }, 0);
    
    const impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;
    
    return { subtotal, impuesto, total };
  };

  const handleGenerarComprobante = async () => {
    
    if (detalle.length === 0) {
      mostrarAlerta.advertencia("Debe agregar al menos un producto");
      return;
    }

    if (tipoComprobante === 2 && !datosCliente) {
      mostrarAlerta.advertencia("Para factura debe seleccionar un cliente con RUC");
      return;
    }

    if (!metodoPagoSeleccionado) {
      mostrarAlerta.advertencia("Debe seleccionar un método de pago");
      return;
    }

    setCargando(true);

    try {
      const ventaData = {
        tipoComprobante: Number(tipoComprobante),
        medioPago: Number(metodoPagoSeleccionado),
        cliente: {}
      };

      if (tipoComprobante === 2) {
        if (datosCliente) {
          ventaData.cliente = {
            idTipoDoc: 2,
            numDoc: Number(datosCliente.numeroDocumento),
            denominacionCliente: datosCliente.nombre,
            direccionCliente: datosCliente.direccion || "",
            email: datosCliente.email || ""
          };
        }
      } else {
        if (datosCliente) {
          ventaData.cliente = {
            idTipoDoc: 1,
            numDoc: Number(datosCliente.numeroDocumento),
            denominacionCliente: datosCliente.nombre,
            email: datosCliente.email || ""
          };
        } else {
          ventaData.cliente = {
            idTipoDoc: 1,
            numDoc: 10000000,
            denominacionCliente: "Clientes Varios",
            email: ""
          };
        }
      }

      ventaData.productos = detalle.map((item) => ({
        idProducto: item.id_producto || item.idProducto || item.id,
        cantidad: item.cantidad
      }));

      if (observaciones.trim() !== "") {
        ventaData.observaciones = observaciones;
      }

      console.log("Enviando venta:", ventaData);

      const respuesta = await generarVentaServicio(ventaData);
      
      if (respuesta && respuesta.ok) {
        setDatosComprobante({
          ...respuesta,
          tipoComprobante,
          tipoComprobanteTexto: tipoComprobante === 2 ? 'Factura' : 'Boleta'
        });
        
        setMostrarModalComprobante(true);
        
        limpiarVenta();
        setObservaciones("");
        setDatosCliente(null);
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al generar el comprobante");
    } finally {
      setCargando(false);
    }
  };

  const handleLimpiarVenta = () => {
    if (detalle.length > 0 || datosCliente) {
      solicitarConfirmacion(
        "¿Estás seguro de limpiar toda la venta?",
        () => {
          limpiarVenta();
          setObservaciones("");
          setDatosCliente(null);
          mostrarAlerta.exito("Venta limpiada correctamente");
        },
        "Limpiar venta"
      );
    }
  };

  const handleCerrarModalComprobante = () => {
    setMostrarModalComprobante(false);
    setDatosComprobante(null);
  };

  const handleDescargarPDF = () => {
    if (datosComprobante?.urlPdf) {
      window.open(datosComprobante.urlPdf, '_blank');
    }
  };

  const handleDescargarXML = () => {
    if (datosComprobante?.urlXml) {
      window.open(datosComprobante.urlXml, '_blank');
    }
  };

  const getTipoDocumentoTexto = (tipoDoc) => {
    switch(tipoDoc) {
      case "1": return "DNI";
      case "2": return "RUC";
      default: return "Documento";
    }
  };

  const { subtotal, impuesto, total } = calcularTotales();

  let filtrados = filtrarPorBusqueda(productos, [
    "nombre_producto", 
    "descripcion_producto"
  ]);

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Punto de Venta
        </h1>
        <FiShoppingCart className="text-2xl text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-3">
            <BarraBusqueda
              valor={terminoBusqueda}
              onChange={setTerminoBusqueda}
              placeholder="Buscar por producto..."
            />
          </div>
          
          {cargandoProductos ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Cargando productos...</p>
              </div>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
              {filtrados.map((producto) => (
                <TarjetaProducto key={producto.id_producto} producto={producto} />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 border-b border-gray-200 dark:border-gray-700 pb-4 lg:pb-0">
            <div className="flex w-full lg:w-auto">
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  tipoComprobante === 1
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTipoComprobante(1)}
              >
                Boleta
              </button>
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  tipoComprobante === 2
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTipoComprobante(2)}
              >
                Factura
              </button>
            </div>
            <div className="w-full lg:w-auto lg:ml-auto">
              <input
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-full lg:w-48 xl:w-56 cursor-default"
                value={tipoComprobante === 1 ? "B001" : "F001"}
                readOnly
              />
            </div>
          </div>
          
          <div className="py-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cliente 
              {tipoComprobante === 2 && <span className="text-red-500"> *</span>} 
              {tipoComprobante === 1 && <span className="text-gray-500 text-xs ml-1">(Opcional)</span>}
            </label>

            {datosCliente ? (
              <div className="flex items-center gap-2 p-3 border border-green-300 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/20">
                <FiCheck className="text-green-600 dark:text-green-400 shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {datosCliente.nombre}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getTipoDocumentoTexto(datosCliente.tipoDocumento)}: {datosCliente.numeroDocumento}
                    {datosCliente.direccion && ` • ${datosCliente.direccion}`}
                  </p>
                </div>
                <button
                  onClick={handleAbrirModalCliente}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                  title="Editar cliente"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={handleEliminarCliente}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Quitar cliente"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <div className="grow flex items-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <FiUser className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-500 text-sm">
                    {tipoComprobante === 1 ? "Clientes Varios" : "Seleccione un cliente con RUC"}
                  </span>
                </div>
                <button
                  onClick={handleAbrirModalCliente}
                  className="w-20 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                  title={tipoComprobante === 1 ? "Agregar cliente (opcional)" : "Agregar cliente (obligatorio)"}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
          
          <div className="py-2">
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <div className="w-full lg:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Pago
                </label>
                {cargandoMetodoPago ? (
                  <div className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm">
                    Cargando métodos de pago...
                  </div>
                ) : (
                  <select
                    value={metodoPagoSeleccionado}
                    onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  >
                    <option value="" disabled>Seleccione método</option>
                    {metodosPago.map((metodo) => (
                      <option key={metodo.id_medio_pago} value={metodo.id_medio_pago}>
                        {metodo.nombre_medio_pago}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="w-full lg:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Observaciones..."
                />
              </div>
            </div>
          </div>

          <DetalleVenta />

          <ResumenVenta subtotal={subtotal} impuesto={impuesto} total={total} />

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLimpiarVenta}
              disabled={detalle.length === 0 && !datosCliente}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Limpiar Todo
            </button>
            <button
              onClick={handleGenerarComprobante}
              disabled={detalle.length === 0 || cargando || (tipoComprobante === 2 && !datosCliente) || !metodoPagoSeleccionado}
              className="flex-1 sm:flex-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                "Generar Comprobante"
              )}
            </button>
          </div>
        </div>
      </div>

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
            tipoComprobante={tipoComprobante} 
          />
        </Modal>
      )}

      <ModalComprobanteGenerado
        estaAbierto={mostrarModalComprobante}
        onCerrar={handleCerrarModalComprobante}
        datosComprobante={datosComprobante}
        onDescargarPDF={handleDescargarPDF}
        onDescargarXML={handleDescargarXML}
      />

      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar="Sí, quitar"
        textoCancelar="Cancelar"
        tipo="peligro"
      />
    </div>
  );
};

export default GenerarVentaPagina;