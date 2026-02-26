import { BsBoxSeam } from "react-icons/bs";
import { useState, useEffect } from "react";
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { useBusqueda } from "../../hooks/useBusqueda";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { FilaInsumo } from "../../componentes/panel-admin/stock/FilaInsumo";
import { ModalNuevoInsumo } from "../../componentes/panel-admin/stock/ModalNuevoInsumo";
import { ModalMovimientoStock } from "../../componentes/panel-admin/stock/ModalMovimientoStock";
import { ModalEditarStock } from "../../componentes/panel-admin/stock/ModalEditarStock";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import mostrarAlerta, { alertasCRUD } from "../../utilidades/toastUtilidades";
import { useInsumosStore } from "../../store/useInsumoStore"; 

const StockInsumosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  
  const {
    insumos,
    total,
    cargando,
    error,
    paginaActual,
    limit,
    cargarInsumos,
    setPagina,
    setLimite,
    limpiarError,
    eliminarInsumo
  } = useInsumosStore();

  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  
  const modalNuevoInsumo = useModal(false);
  const modalMovimientoStock = useModal(false);
  const modalEditarStock = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  const paginacion = usePaginacion({
    paginaActual,
    limite: limit,
    total,
    onPagina: setPagina,
    onLimite: setLimite,
  });

  useEffect(() => {
    cargarInsumos();
  }, [paginaActual, limit]);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  const handleNuevoInsumo = () => {
    modalNuevoInsumo.abrir();
  };

  const handleMovimientoStock = () => {
    modalMovimientoStock.abrir();
  };

  const handleInsumoCreado = async () => {
    await cargarInsumos();
    modalNuevoInsumo.cerrar();
  };

  const handleInsumoActualizado = async () => {
    await cargarInsumos();
    modalEditarStock.cerrar();
    setInsumoSeleccionado(null);
  };

  const handleMovimientoCreado = async () => {
    await cargarInsumos();
    modalMovimientoStock.cerrar();
  };

  const solicitarConfirmacionEliminar = (insumo) => {
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar el insumo "${insumo.nombreInsumo}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await eliminarInsumo(insumo.idInsumo);
          alertasCRUD.eliminado();
        } catch (error) {
          mostrarAlerta.error('No se puede eliminar un insumo con stock.');
        }
      },
      {
        titulo: "Eliminar Insumo",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const cancelarEliminacion = () => {
    confirmacionEliminar.ocultarConfirmacion();
  };

  const handleEditarStock = (insumo) => {
    setInsumoSeleccionado(insumo);
    modalEditarStock.abrir();
  };

  const insumosFiltrados = filtrarPorBusqueda(insumos, [
    "nombreInsumo",
    "unidadMedida",
    "categoriaProducto"
  ]);

  const filasInsumos = insumosFiltrados.map((insumo) => (
    <FilaInsumo 
      key={insumo.id_insumo} 
      insumo={insumo} 
      onEditarStock={handleEditarStock}
      onEliminarInsumo={solicitarConfirmacionEliminar}
    />
  ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BsBoxSeam className="mr-3 text-2xl text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Stock de Insumos
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {total > 0
                ? `${total} insumo${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`
                : 'Sin insumos registrados'}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestión de materia prima y bebidas</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <BarraBusqueda
              valor={terminoBusqueda} 
              onChange={setTerminoBusqueda}
              placeholder="Buscar por nombre de insumo, unidad o categoría..."
            />
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleMovimientoStock}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <BsBoxSeam className="text-lg shrink-0" />
                <span className="truncate">Movimiento Stock</span>
              </button>
              
              <button 
                onClick={handleNuevoInsumo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer text-sm sm:text-base"
              >
                <span className="text-lg">+</span>
                <span className="truncate">Nuevo Insumo</span>
              </button>
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando insumos...</p>
          </div>
        ) : (
          <>
            <Tabla
              encabezados={["Insumo", "Categoría", "Stock Actual", "Unidad", "Estado Stock", "Acciones"]}
              registros={filasInsumos}
            />
            
            {insumosFiltrados.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <BsBoxSeam className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {terminoBusqueda 
                    ? "No se encontraron insumos que coincidan con la búsqueda" 
                    : "No hay insumos registrados aún"}
                </p>
                {!terminoBusqueda && (
                  <button
                    onClick={handleNuevoInsumo}
                    className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <span className="text-lg">+</span>
                    <span>Registrar primer insumo</span>
                  </button>
                )}
              </div>
            )}
            
            {total > 0 && (
              <div className="mt-6">
                <Paginacion {...paginacion} />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        estaAbierto={modalNuevoInsumo.estaAbierto}
        onCerrar={modalNuevoInsumo.cerrar}
        titulo="Agregar Nuevo Insumo"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalNuevoInsumo 
          onClose={modalNuevoInsumo.cerrar}
          onGuardar={handleInsumoCreado}
        />
      </Modal>

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

      <Modal
        estaAbierto={modalEditarStock.estaAbierto}
        onCerrar={() => {
          modalEditarStock.cerrar();
          setInsumoSeleccionado(null);
        }}
        titulo={`Editar Insumo: ${insumoSeleccionado?.nombreInsumo || ''}`}
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {insumoSeleccionado && (
          <ModalEditarStock 
            insumo={insumoSeleccionado}
            onClose={() => {
              modalEditarStock.cerrar();
              setInsumoSeleccionado(null);
            }}
            onGuardar={handleInsumoActualizado}
          />
        )}
      </Modal>

      <ModalConfirmacion
        visible={confirmacionEliminar.confirmacionVisible}
        onCerrar={cancelarEliminacion}
        onConfirmar={confirmacionEliminar.confirmarAccion}
        titulo={confirmacionEliminar.tituloConfirmacion}
        mensaje={confirmacionEliminar.mensajeConfirmacion}
        tipo={confirmacionEliminar.tipoConfirmacion}
        textoConfirmar={confirmacionEliminar.textoConfirmar}
        textoCancelar={confirmacionEliminar.textoCancelar}
      />
    </div>
  );
};

export default StockInsumosSeccion;