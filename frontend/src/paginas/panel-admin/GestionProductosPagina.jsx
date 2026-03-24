import { BsBoxSeam } from "react-icons/bs";
import { useState } from 'react';
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import { useProductos } from "../../hooks/useProductos";
import { ModalReceta } from '../../componentes/panel-admin/productos/ModalReceta';
import { ModalNuevoProducto } from '../../componentes/panel-admin/productos/ModalNuevoProducto';
import { FilaProducto } from '../../componentes/panel-admin/productos/FilaProductos';
import { ModalEditarProducto } from "../../componentes/panel-admin/productos/ModalEditarProducto";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import { deshabilitarProductoServicio } from "../../servicios/productoServicios";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const GestionProductosPagina = () => {
  const { productos, cargando, refetch } = useProductos();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const modalReceta = useModal(false);
  const modalNuevoProducto = useModal(false);
  const modalEditarProducto = useModal(false);
  const confirmacionDeshabilitar = useConfirmacion();

  const productosFiltrados = productos.filter(p =>
    p.nombre_producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion_producto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleGestionarInsumos = (producto) => {
    setProductoSeleccionado(producto);
    modalReceta.abrir();
  };

  const handleNuevoProducto = () => modalNuevoProducto.abrir();

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    modalEditarProducto.abrir();
  };

  const handleDeshabilitarProducto = (producto) => {
    confirmacionDeshabilitar.solicitarConfirmacion(
      `¿Estás seguro de deshabilitar "${producto.nombre_producto}"? No aparecerá en el menú.`,
      async () => {
        try {
          await deshabilitarProductoServicio(producto.id_producto);
          mostrarAlerta.exito('Producto deshabilitado correctamente');
          refetch();
        } catch (error) {
          mostrarAlerta.error(error.message || 'Error al deshabilitar el producto');
        }
      },
      {
        titulo: "Deshabilitar Producto",
        tipo: "peligro",
        textoConfirmar: "Sí, deshabilitar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const handleGuardarProducto = () => {
    refetch();
    modalNuevoProducto.cerrar();
    modalEditarProducto.cerrar();
  };

  const filasProductos = productosFiltrados.map((producto) => (
    <FilaProducto
      key={producto.id_producto}
      producto={producto}
      onGestionarInsumos={handleGestionarInsumos}
      onEditarProducto={handleEditarProducto}
      onDeshabilitarProducto={handleDeshabilitarProducto}
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
    <div className="p-4">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <BsBoxSeam className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Administra los productos del menú y sus recetas</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <BarraBusqueda
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por nombre o descripción..."
          />
          <button
            onClick={handleNuevoProducto}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BsBoxSeam className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {busqueda ? "No se encontraron productos con ese criterio" : "No hay productos registrados aún"}
          </p>
        </div>
      ) : (
        <Tabla
          encabezados={["PRODUCTO", "PRECIO", "CATEGORÍA", "INVENTARIO", "GESTIÓN INSUMOS", "ACCIONES"]}
          registros={filasProductos}
        />
      )}

      <Modal
        estaAbierto={modalReceta.estaAbierto}
        onCerrar={() => { modalReceta.cerrar(); refetch(); }}
        titulo={`Insumos: ${productoSeleccionado?.nombre_producto || ''}`}
        tamaño="xl"
        mostrarHeader={true}
      >
        {productoSeleccionado && (
          <ModalReceta
            producto={productoSeleccionado}
            onClose={() => { modalReceta.cerrar(); refetch(); }}
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

      <ModalConfirmacion
        visible={confirmacionDeshabilitar.confirmacionVisible}
        onCerrar={confirmacionDeshabilitar.ocultarConfirmacion}
        onConfirmar={confirmacionDeshabilitar.confirmarAccion}
        titulo={confirmacionDeshabilitar.tituloConfirmacion}
        mensaje={confirmacionDeshabilitar.mensajeConfirmacion}
        tipo={confirmacionDeshabilitar.tipoConfirmacion}
        textoConfirmar={confirmacionDeshabilitar.textoConfirmar}
        textoCancelar={confirmacionDeshabilitar.textoCancelar}
      />
    </div>
  );
};

export default GestionProductosPagina;