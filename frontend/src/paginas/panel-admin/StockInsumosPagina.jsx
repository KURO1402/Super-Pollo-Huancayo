import { BsBoxSeam } from "react-icons/bs";
import { useState, useEffect } from "react";
import { eliminarInsumoServicio, listarInsumoServicio } from "../../servicios/insumosServicios";
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

const StockInsumosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina, 
    setItemsPorPagina, 
    paginar 
  } = usePaginacion(5);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [insumoAEliminar, setInsumoAEliminar] = useState(null);
  const [ insumos, setInsumos ] = useState([])
  const [ error, setError ] = useState(null);
  const modalNuevoInsumo = useModal(false);
  const modalMovimientoStock = useModal(false);
  const modalEditarStock = useModal(false);
  const confirmacionEliminar = useConfirmacion();
  const obtenerInsumos = async () => {
    try {
      const respuesta = await listarInsumoServicio();
      setInsumos(respuesta);
    } catch (error) {
      setError("Error al obtener los insumos");
    }
  };
  useEffect(() => {
    obtenerInsumos();
  }, []);

  let filtrados = filtrarPorBusqueda(insumos, [
    "nombreInsumo",
    "unidadMedida",
    "categoriaProducto"
  ]);
  const { datosPaginados, totalPaginas } = paginar(filtrados);
  
  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  const handleNuevoInsumo = () => {
    modalNuevoInsumo.abrir();
  };

  const handleMovimientoStock = () => {
    modalMovimientoStock.abrir();
  };

  const handleInsumoCreado = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await obtenerInsumos();
    modalNuevoInsumo.cerrar();
  };

  const handleInsumoActualizado = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await obtenerInsumos();
    modalEditarStock.cerrar();
    setInsumoSeleccionado(null);
  };

  const handleMovimientoCreado = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await obtenerInsumos();
    modalMovimientoStock.cerrar();
  };

  const solicitarConfirmacionEliminar = (insumo) => {
  setInsumoAEliminar(insumo);
  
  confirmacionEliminar.solicitarConfirmacion(
    `¿Estás seguro de eliminar el insumo "${insumo.nombreInsumo}"? Esta acción no se puede deshacer.`,
    () => {
      handleEliminarInsumo(insumo.idInsumo);
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
  setInsumoAEliminar(null);
  confirmacionEliminar.ocultarConfirmacion();
};

const handleEliminarInsumo = async (idInsumo) => {
  try {
    await eliminarInsumoServicio(idInsumo);
    setInsumos(prev => prev.filter(insumo => insumo.idInsumo !== idInsumo));
    
    alertasCRUD.eliminado();
  } catch (error) {
    mostrarAlerta.error('No se puede eliminar un insumo con stock.')
  } finally {
    setInsumoAEliminar(null);
  }
};
  const handleEditarStock = (insumo) => {
    setInsumoSeleccionado(insumo);
    modalEditarStock.abrir();
  };
  const filasInsumos = datosPaginados.map((insumo) => (
    <FilaInsumo 
      key={insumo.idInsumo} 
      insumo={insumo} 
      onEditarStock={handleEditarStock}
      onEliminarInsumo={solicitarConfirmacionEliminar}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <BsBoxSeam className="mr-3 text-2xl text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock de los Insumos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Gestión de materia prima y bebidas</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre de insumo, unidad o categoría..."
          />
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleMovimientoStock}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer text-sm sm:text-base flex-1 sm:flex-none min-w-0"
            >
              <BsBoxSeam className="text-lg flex-shrink-0" />
              <span className="truncate">Movimiento Stock</span>
            </button>
            
            <button 
              onClick={handleNuevoInsumo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer text-sm sm:text-base flex-1 sm:flex-none min-w-0"
            >
              <span className="text-lg">+</span>
              <span className="truncate">Nuevo Insumo</span>
            </button>
          </div>
        </div>
      </div>
      <Tabla
        encabezados={["Insumo", "Categoría", "Stock Actual", "Unidad", "Estado Stock", "Acciones"]}
        registros={filasInsumos}
      /> 
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={handleCambiarPagina}
        itemsPorPagina={itemsPorPagina}
        alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
        mostrarSiempre={true}
      />
      <Modal
        estaAbierto={modalNuevoInsumo.estaAbierto}
        onCerrar={modalNuevoInsumo.cerrar}
        titulo="Agregar Nuevo Insumo"
        tamaño="md"
        mostrarHeader={true}
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
        mostrarHeader={true}
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
        mostrarHeader={true}
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
      <div className="p-2">
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
    </div>
  );
};

export default StockInsumosSeccion;