import { useEffect } from 'react';
import { MdHistory } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";
import { useStockStore } from '../../store/useStockStore';
import { usePaginacion } from '../../hooks/usePaginacion';
import { useModal } from '../../hooks/useModal';
import { useBusqueda } from '../../hooks/useBusqueda';
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { FilaSalida } from "../../componentes/panel-admin/stock/FilaSalida";
import { ModalMovimientoSalidas } from '../../componentes/panel-admin/stock/ModalMovimientoSalidas';

const HistorialSalidasPagina = () => {
  const {
    salidas,
    totalSalidas,
    cargando,
    error,
    paginaSalida,
    limitSalida,
    cargarSalidas,
    setPaginaSalida,
    setLimitSalida,
    limpiarError,
  } = useStockStore();

  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const modalSalida = useModal(false);

  const paginacion = usePaginacion({
    paginaActual: paginaSalida,
    limite: limitSalida,
    total: totalSalidas,
    onPagina: setPaginaSalida,
    onLimite: setLimitSalida,
  });

  useEffect(() => {
    cargarSalidas();
  }, [paginaSalida, limitSalida]);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  const handleMovimientoStock = () => modalSalida.abrir();

  const handleMovimientoCreado = async () => {
    await cargarSalidas();
    modalSalida.cerrar();
  };

  const salidasFiltradas = filtrarPorBusqueda(salidas, [
    "nombre_insumo",
    "cantidad_movimiento",
    "detalle_movimiento",
    "encargado_movimiento"
  ]);

  const filasSalidas = salidasFiltradas.map((salida) => (
    <FilaSalida
      key={salida.id_movimiento_stock || salida.idMovimientoStock}
      salida={salida}
    />
  ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full p-4">

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdHistory className="text-3xl text-red-500 dark:text-red-400 mr-2 shrink-0" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Historial de Salidas
              </h1>
            </div>
            <button
              onClick={handleMovimientoStock}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer text-sm"
            >
              <BsPlusLg className="text-lg" />
              <span>Nueva salida</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {totalSalidas > 0
              ? `${totalSalidas} salida${totalSalidas !== 1 ? 's' : ''} registrada${totalSalidas !== 1 ? 's' : ''}`
              : 'Sin salidas registradas'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, cantidad, encargado o detalle..."
          />
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando salidas...</p>
          </div>
        ) : (
          <>
            {salidasFiltradas.length > 0 ? (
              <Tabla
                encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Encargado", "Detalle"]}
                registros={filasSalidas}
              />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <MdHistory className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {terminoBusqueda
                    ? "No se encontraron salidas que coincidan con la búsqueda"
                    : "No hay salidas registradas aún"}
                </p>
                {!terminoBusqueda && (
                  <button
                    onClick={handleMovimientoStock}
                    className="mt-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <BsPlusLg size={16} />
                    <span>Registrar primera salida</span>
                  </button>
                )}
              </div>
            )}

            {totalSalidas > 0 && (
              <div className="mt-6">
                <Paginacion {...paginacion} />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        estaAbierto={modalSalida.estaAbierto}
        onCerrar={modalSalida.cerrar}
        titulo="Registrar Salida de Stock"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalMovimientoSalidas
          onClose={modalSalida.cerrar}
          onGuardar={handleMovimientoCreado}
        />
      </Modal>
    </div>
  );
};

export default HistorialSalidasPagina;