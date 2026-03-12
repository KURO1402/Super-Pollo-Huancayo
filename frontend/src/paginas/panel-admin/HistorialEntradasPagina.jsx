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
import { FilaEntrada } from "../../componentes/panel-admin/stock/FilaEntrada";
import { ModalMovimientoStock } from "../../componentes/panel-admin/stock/ModalMovimientoStock";

const HistorialEntradasPagina = () => {
  const {
    entradas,
    totalEntradas,
    cargando,
    error,
    paginaEntrada,
    limitEntrada,
    cargarEntradas,
    setPaginaEntrada,
    setLimitEntrada,
    limpiarError,
  } = useStockStore();

  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const modalMovimientoStock = useModal(false);

  const paginacion = usePaginacion({
    paginaActual: paginaEntrada,
    limite: limitEntrada,
    total: totalEntradas,
    onPagina: setPaginaEntrada,
    onLimite: setLimitEntrada,
  });

  useEffect(() => {
    cargarEntradas();
  }, [paginaEntrada, limitEntrada]);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  const handleMovimientoStock = () => modalMovimientoStock.abrir();

  const handleMovimientoCreado = async () => {
    await cargarEntradas();
    modalMovimientoStock.cerrar();
  };

  const entradasFiltradas = filtrarPorBusqueda(entradas, [
    "nombre_insumo",
    "cantidad_movimiento",
    "detalle_movimiento",
    "encargado_movimiento"
  ]);

  const filasEntradas = entradasFiltradas.map((entrada) => (
    <FilaEntrada
      key={entrada.id_movimiento_stock || entrada.idMovimientoStock}
      entrada={entrada}
    />
  ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdHistory className="text-3xl text-green-500 dark:text-green-400 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Historial de Entradas
              </h1>
            </div>
            <button
              onClick={handleMovimientoStock}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer text-sm"
            >
              <BsPlusLg className="text-lg" />
              <span>Nueva entrada</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {totalEntradas > 0
              ? `${totalEntradas} entrada${totalEntradas !== 1 ? 's' : ''} registrada${totalEntradas !== 1 ? 's' : ''}`
              : 'Sin entradas registradas'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, cantidad, usuario o detalle..."
          />
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando entradas...</p>
          </div>
        ) : (
          <>
            {entradasFiltradas.length > 0 ? (
              <Tabla
                encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Encargado", "Detalle"]}
                registros={filasEntradas}
              />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <MdHistory className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {terminoBusqueda
                    ? "No se encontraron entradas que coincidan con la búsqueda"
                    : "No hay entradas registradas aún"}
                </p>
                {!terminoBusqueda && (
                  <button
                    onClick={handleMovimientoStock}
                    className="mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <BsPlusLg size={16} />
                    <span>Registrar primera entrada</span>
                  </button>
                )}
              </div>
            )}

            {totalEntradas > 0 && (
              <div className="mt-6">
                <Paginacion {...paginacion} />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        estaAbierto={modalMovimientoStock.estaAbierto}
        onCerrar={modalMovimientoStock.cerrar}
        titulo="Registrar Movimiento de Stock"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalMovimientoStock
          onClose={modalMovimientoStock.cerrar}
          onGuardar={handleMovimientoCreado}
        />
      </Modal>
    </div>
  );
};

export default HistorialEntradasPagina;