import { useState, useEffect } from "react";
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { FilaComprobante } from "../../componentes/panel-admin/ventas/FilaComprobante";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { useBusqueda } from "../../hooks/useBusqueda"; 
import { useFiltro } from "../../hooks/useFiltro";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { obtenerVentasServicio, obtenerComprobanteServicio, obtenerDetalleVentaServicio } from "../../servicios/ventasServicio";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const RegistroVentasSeccion = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, itemsPorPagina, setItemsPorPagina, paginar } = usePaginacion(5);
  const { estaAbierto, abrir, cerrar } = useModal();

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setCargando(true);
        const ventasData = await obtenerVentasServicio();
        setVentas(ventasData);
      } catch (error) {
        setVentas([]);
      } finally {
        setCargando(false);
      }
    };

    cargarVentas();
  }, []);

  const handleVerDetalle = async (idVenta) => {
    try {
      setCargandoDetalle(true);
      const detalles = await obtenerDetalleVentaServicio(idVenta);
      setDetalleVenta(detalles);
      abrir();
    } catch (error) {
      mostrarAlerta.error("Error al cargar el detalle de la venta");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const handleDescargarComprobante = async (idVenta) => {
    try {
      const comprobante = await obtenerComprobanteServicio(idVenta);
      if (comprobante.urlComprobantePDF) {
        window.open(comprobante.urlComprobantePDF, '_blank');
        mostrarAlerta.exito("Comprobante descargado");
      } else {
        mostrarAlerta.error("No se encontró el comprobante PDF");
      }
    } catch (error) {
      mostrarAlerta.error("Error al descargar el comprobante");
    }
  };

  let filtrados = filtrarPorBusqueda(ventas, [
    "comprobante",
    "nombreCliente",
    "nombreTipoComprobante",
  ]);

  if (filtro !== "todos") {
    filtrados = filtrados.filter(venta => {
      if (filtro === "aceptado") {
        return venta.aceptadaPorSunat === 1;
      } else if (filtro === "denegado") {
        return venta.aceptadaPorSunat === 0;
      }
      return true;
    });
  }

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  const filasComprobantes = datosPaginados.map((venta) => (
    <FilaComprobante 
      key={venta.idVenta} 
      venta={venta}
      onVerDetalle={() => handleVerDetalle(venta.idVenta)}
      onDescargarComprobante={() => handleDescargarComprobante(venta.idVenta)}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Ventas</h1>
        <p className="text-gray-600 dark:text-gray-400">Historial de comprobantes electrónicos</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por comprobante, cliente o tipo..."
          />
  
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={[
              { value: "todos", label: "Todos los estados" },
              { value: "aceptado", label: "Aceptados por SUNAT" },
              { value: "denegado", label: "Denegados por SUNAT" },
            ]}
          />
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando ventas...</p>
          </div>
        </div>
      ) : ventas.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay ventas registradas</p>
        </div>
      ) : (
        <>
          <Tabla
            encabezados={["Comprobante", "Cliente", "Cajero" , "Total", "Fechas", "Estado SUNAT", "Acciones"]}
            registros={filasComprobantes}
          />
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={handleCambiarPagina}
            itemsPorPagina={itemsPorPagina}
            alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
            mostrarSiempre={true}
          />
        </>
      )}

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={cerrar}
        titulo="Detalle de Venta"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {cargandoDetalle ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando detalle...</p>
            </div>
          </div>
        ) : detalleVenta && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IGV
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {detalleVenta.map((detalle) => (
                    <tr key={detalle.idDetalleVenta}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {detalle.nombreProducto}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {detalle.cantidadProducto}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        S/ {parseFloat(detalle.precioUnitario).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        S/ {parseFloat(detalle.subtotal).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        S/ {parseFloat(detalle.igv).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        S/ {parseFloat(detalle.totalProducto).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegistroVentasSeccion;