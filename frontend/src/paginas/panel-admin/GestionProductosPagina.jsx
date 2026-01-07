import { BsBoxSeam } from "react-icons/bs";
import { useState } from 'react';
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import { useBusqueda } from "../../hooks/useBusqueda";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useProductos } from "../../hooks/useProductos";
import { ModalReceta } from '../../componentes/panel-admin/productos/ModalReceta';
import { ModalNuevoProducto } from '../../componentes/panel-admin/productos/ModalNuevoProducto'
import { FilaProducto } from '../../componentes/panel-admin/productos/FilaProductos';
import { eliminarProductoServicio } from "../../servicios/productoServicios";
import mostrarAlerta from "../../utilidades/toastUtilidades";
import { ModalEditarProducto } from "../../componentes/panel-admin/productos/ModalEditarProducto";
import ModalGestionCategorias from "../../componentes/panel-admin/productos/ModalGestionCategorias";

const GestionProductosPagina = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { productos, cargando, error, refetch } = useProductos();
  const { paginaActual, setPaginaActual, paginar, itemsPorPagina, setItemsPorPagina } = usePaginacion(8);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const modalReceta = useModal(false);
  const modalNuevoProducto = useModal(false);
  const modalEditarProducto = useModal(false);
  const modalGestionCategorias = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  function handleGestionarInsumos(producto) {
    setProductoSeleccionado(producto);
    modalReceta.abrir();
  }

  function handleNuevoProducto() {
    modalNuevoProducto.abrir();
  }

  function handleEditarProducto(producto) {
    setProductoSeleccionado(producto);
    modalEditarProducto.abrir();
  }

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  function handleAbrirCategorias() {
    modalGestionCategorias.abrir();
  }

  function handleSolicitarEliminar(producto) {
    setProductoAEliminar(producto);
    
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar el producto "${producto.nombreProducto}"? Esta acción no se puede deshacer.`,
      () => {
        handleEliminarProducto(producto.idProducto);
      },
      {
        titulo: "Eliminar Producto",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  }

  function cancelarEliminacion() {
    setProductoAEliminar(null);
    confirmacionEliminar.ocultarConfirmacion();
  }

  async function handleEliminarProducto(idProducto) {
    try {
      await eliminarProductoServicio(idProducto);
      
      refetch();
      mostrarAlerta.exito('Producto eliminado exitosamente');
      
    } catch (error) {

    } finally {
      setProductoAEliminar(null);
    }
  }
  function handleGuardarProducto() {
    refetch();
    modalNuevoProducto.cerrar();
    modalEditarProducto.cerrar();
  }

  let productosFiltrados = filtrarPorBusqueda(productos, [
    "nombreProducto", 
    "descripcionProducto"
  ]);

  const { datosPaginados, totalPaginas } = paginar(productosFiltrados);

  const filasProductos = datosPaginados.map((producto) => (
    <FilaProducto 
      key={producto.idProducto}
      producto={producto}
      onGestionarInsumos={handleGestionarInsumos}
      onEditarProducto={handleEditarProducto}
      onEliminarProducto={handleSolicitarEliminar} 
    />
  ));

  if (cargando) {
    return (
      <div className="p-2">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <BsBoxSeam className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Administra los productos del menú y sus recetas</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre o descripción..."
          />
          <button 
            onClick={handleNuevoProducto}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
            + Nuevo Producto
          </button>
          <button 
            onClick={handleAbrirCategorias}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
            Gestión de Categorías
          </button>
        </div>
      </div>

      <Tabla
        encabezados={["PRODUCTO", "PRECIO", "CATEGORIA", "USA INSUMOS", "GESTIÓN INSUMOS", "ACCIONES"]}
        registros={filasProductos}
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
        estaAbierto={modalReceta.estaAbierto}
        onCerrar={modalReceta.cerrar}
        titulo={`Insumos: ${productoSeleccionado?.nombreProducto || ''}`}
        tamaño="xl"
        mostrarHeader={true}
      >
        {productoSeleccionado && (
          <ModalReceta 
            producto={productoSeleccionado}
            onClose={modalReceta.cerrar}
            onGuardar={refetch} 
          />
        )}
      </Modal>

      <Modal
        estaAbierto={modalNuevoProducto.estaAbierto}
        onCerrar={modalNuevoProducto.cerrar}
        titulo="Agregar Nuevo Producto"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalNuevoProducto 
          onClose={modalNuevoProducto.cerrar}
          onGuardar={handleGuardarProducto}
        />
      </Modal>

      <Modal
        estaAbierto={modalEditarProducto.estaAbierto}
        onCerrar={modalEditarProducto.cerrar}
        titulo={`Editar Producto: ${productoSeleccionado?.nombreProducto || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {productoSeleccionado && (
          <ModalEditarProducto 
            producto={productoSeleccionado}
            onClose={modalEditarProducto.cerrar}
            onGuardar={handleGuardarProducto} 
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

      <Modal
        estaAbierto={modalGestionCategorias.estaAbierto}
        onCerrar={modalGestionCategorias.cerrar}
        titulo="Gestión de Categorías"
        tamaño="lg" 
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalGestionCategorias />
      </Modal>
    </div>
  );
};

export default GestionProductosPagina;