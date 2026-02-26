import { BsBoxSeam } from "react-icons/bs";
import { useState } from 'react';
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import { useBusqueda } from "../../hooks/useBusqueda";
import { useProductos } from "../../hooks/useProductos";
import { ModalReceta } from '../../componentes/panel-admin/productos/ModalReceta';
import { ModalNuevoProducto } from '../../componentes/panel-admin/productos/ModalNuevoProducto'
import { FilaProducto } from '../../componentes/panel-admin/productos/FilaProductos';
import { habilitarProductoServicio, deshabilitarProductoServicio } from "../../servicios/productoServicios";
import mostrarAlerta from "../../utilidades/toastUtilidades";
import { ModalEditarProducto } from "../../componentes/panel-admin/productos/ModalEditarProducto";
import ModalGestionCategorias from "../../componentes/panel-admin/productos/ModalGestionCategorias";

const GestionProductosPagina = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { productos, cargando, error, refetch } = useProductos();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const modalReceta = useModal(false);
  const modalNuevoProducto = useModal(false);
  const modalEditarProducto = useModal(false);
  const modalGestionCategorias = useModal(false);

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

  const handleToggleProducto = async (producto) => {
    try {
      const idProducto = producto.id_producto;
      const estadoActual = producto.estado === 1;
      
      if (estadoActual) {
        await deshabilitarProductoServicio(idProducto);
        mostrarAlerta.exito('Producto deshabilitado correctamente');
      } else {
        await habilitarProductoServicio(idProducto);
        mostrarAlerta.exito('Producto habilitado correctamente');
      }
      
      refetch();
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al cambiar estado del producto';
      mostrarAlerta.error(mensajeError);
    }
  };

  function handleGuardarProducto() {
    refetch();
    modalNuevoProducto.cerrar();
    modalEditarProducto.cerrar();
  }

  let productosFiltrados = filtrarPorBusqueda(productos, [
    "nombre_producto", 
    "descripcion_producto"
  ]);

  const filasProductos = productosFiltrados.map((producto) => (
    <FilaProducto 
      key={producto.id_producto}
      producto={producto}
      onGestionarInsumos={handleGestionarInsumos}
      onEditarProducto={handleEditarProducto}
      onToggleProducto={handleToggleProducto}
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
        </div>
      </div>

      <Tabla
        encabezados={["PRODUCTO", "PRECIO", "CATEGORIA", "USA INSUMOS", "GESTIÓN INSUMOS", "ACCIONES"]}
        registros={filasProductos}
      />

      <Modal
        estaAbierto={modalReceta.estaAbierto}
        onCerrar={modalReceta.cerrar}
        titulo={`Insumos: ${productoSeleccionado?.nombre_producto || ''}`}
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
        titulo={`Editar Producto: ${productoSeleccionado?.nombre_producto || ''}`}
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