import { BsBoxSeam } from "react-icons/bs";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { useBusqueda } from "../../hooks/useBusqueda";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { FilaInsumo } from "../../componentes/panel-admin/stock/FilaInsumo";
import { ModalNuevoInsumo } from "../../componentes/panel-admin/stock/ModalNuevoInsumo";
import { ModalEditarInsumo } from "../../componentes/panel-admin/stock/ModalEditarInsumo";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import mostrarAlerta, { alertasCRUD } from "../../utilidades/toastUtilidades";
import { useInsumosStore } from "../../store/useInsumoStore";

const StockInsumosSeccion = () => {
  const navigate = useNavigate();
  const { terminoBusqueda, setTerminoBusqueda } = useBusqueda();

  const {
    insumos, total, cargando, error,
    paginaActual, limit,
    cargarInsumos, setPagina, setLimite, limpiarError, eliminarInsumo
  } = useInsumosStore();

  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [filtroNivelStock, setFiltroNivelStock] = useState('');
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  // Lista local de insumos para reflejar cambios sin esperar al servidor
  const [insumosLocales, setInsumosLocales] = useState([]);

  const modalNuevoInsumo = useModal(false);
  const modalEditarInsumo = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  const paginacion = usePaginacion({
    paginaActual,
    limite: limit,
    total,
    onPagina: setPagina,
    onLimite: setLimite,
  });

  useEffect(() => {
    cargarInsumos(terminoBusqueda, filtroNivelStock);
  }, [paginaActual, limit, terminoBusqueda, filtroNivelStock]);

  // Sincronizar lista local con la del store
  useEffect(() => {
    setInsumosLocales(insumos);
  }, [insumos]);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  useEffect(() => {
    let timer;
    if (cargando) {
      timer = setTimeout(() => setMostrarSpinner(true), 300);
    } else {
      setMostrarSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [cargando]);

  const hayFiltrosActivos = terminoBusqueda || filtroNivelStock;

  const handleNuevoInsumo = () => modalNuevoInsumo.abrir();

  const handleInsumoCreado = async () => {
    await cargarInsumos(terminoBusqueda, filtroNivelStock);
    modalNuevoInsumo.cerrar();
  };

  const handleInsumoActualizado = (insumoActualizado) => {
    // Reflejar el cambio inmediatamente en la tabla local
    setInsumosLocales(prev =>
      prev.map(i => i.id_insumo === insumoActualizado.id_insumo ? insumoActualizado : i)
    );
    modalEditarInsumo.cerrar();
    setInsumoSeleccionado(null);
  };

  const solicitarConfirmacionEliminar = (insumo) => {
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar el insumo "${insumo.nombre_insumo}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await eliminarInsumo(insumo.id_insumo);
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

  const cancelarEliminacion = () => confirmacionEliminar.ocultarConfirmacion();

  const handleEditarStock = (insumo) => {
    setInsumoSeleccionado(insumo);
    modalEditarInsumo.abrir();
  };

  const handleLimpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroNivelStock('');
    setPagina(1);
  };

  const filasInsumos = insumosLocales.map((insumo) => (
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

        {/* Header */}
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

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <BarraBusqueda
              valor={terminoBusqueda}
              onChange={setTerminoBusqueda}
              placeholder="Buscar por nombre de insumo..."
            />

            <select
              value={filtroNivelStock}
              onChange={(e) => {
                setFiltroNivelStock(e.target.value);
                setPagina(1);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="critico">Stock Crítico</option>
              <option value="bajo">Stock Bajo</option>
              <option value="normal">Stock Normal</option>
            </select>

            {/* Limpiar: solo visible cuando hay filtros activos */}
            {hayFiltrosActivos && (
              <button
                onClick={handleLimpiarFiltros}
                className="px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors text-sm"
              >
                Limpiar
              </button>
            )}

            {/* Nuevo Insumo primero, luego Entrada y Salida */}
            <button
              onClick={handleNuevoInsumo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer text-sm whitespace-nowrap"
            >
              <span className="text-lg">+</span>
              Nuevo Insumo
            </button>

            <button
              onClick={() => navigate('/admin/stock/entrada')}
              className="px-3 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <FiArrowDown size={14} />
              Entrada
            </button>

            <button
              onClick={() => navigate('/admin/stock/salida')}
              className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <FiArrowUp size={14} />
              Salida
            </button>
          </div>
        </div>

        {/* Contenido */}
        {mostrarSpinner ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando insumos...</p>
          </div>
        ) : insumosLocales.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <BsBoxSeam className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {terminoBusqueda || filtroNivelStock
                ? "No se encontraron insumos que coincidan con los filtros"
                : "No hay insumos registrados aún"}
            </p>
            {!terminoBusqueda && !filtroNivelStock && (
              <button
                onClick={handleNuevoInsumo}
                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-2 mx-auto cursor-pointer"
              >
                <span className="text-lg">+</span>
                Registrar primer insumo
              </button>
            )}
          </div>
        ) : (
          <>
            <Tabla
              encabezados={["Insumo", "Stock Actual", "Unidad", "Estado Stock", "Acciones"]}
              registros={filasInsumos}
            />
            {total > 0 && (
              <div className="mt-6">
                <Paginacion {...paginacion} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <Modal
        estaAbierto={modalNuevoInsumo.estaAbierto}
        onCerrar={modalNuevoInsumo.cerrar}
        titulo="Agregar Nuevo Insumo"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalNuevoInsumo onClose={modalNuevoInsumo.cerrar} onGuardar={handleInsumoCreado} />
      </Modal>

      <Modal
        estaAbierto={modalEditarInsumo.estaAbierto}
        onCerrar={() => { modalEditarInsumo.cerrar(); setInsumoSeleccionado(null); }}
        titulo={`Editar Insumo: ${insumoSeleccionado?.nombre_insumo || ''}`}
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {insumoSeleccionado && (
          <ModalEditarInsumo
            key={insumoSeleccionado.id_insumo}
            insumo={insumoSeleccionado}
            onClose={() => { modalEditarInsumo.cerrar(); setInsumoSeleccionado(null); }}
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