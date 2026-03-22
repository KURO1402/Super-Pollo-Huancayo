import { useState } from 'react';
import { FiImage, FiPlusCircle } from 'react-icons/fi';
import { useProductos } from '../../hooks/useProductos';
import { TarjetaProducto } from '../../componentes/panel-admin/productos/TarjetaProducto';
import { ModalModificarImagen } from '../../componentes/panel-admin/productos/ModalModificarImagen';
import { ModalAgregarImagen } from '../../componentes/panel-admin/productos/ModalAgregarImagen';
import { ModalConfirmacion } from '../../componentes/ui/modal/ModalConfirmacion';
import Modal from '../../componentes/ui/modal/Modal';
import { useModal } from '../../hooks/useModal';
import { useConfirmacion } from '../../hooks/useConfirmacion';
import { eliminarImagenProductoServicio } from '../../servicios/productoServicios';
import mostrarAlerta from '../../utilidades/toastUtilidades';

const GestionImagenesPagina = () => {
  const { imagenesProductos, cargando, refetch } = useProductos();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [imagenAEliminar, setImagenAEliminar] = useState(null);
  
  const modalModificarImagen = useModal(false);
  const modalAgregarImagen = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  const handleModificarImagen = (imagen) => {
    setProductoSeleccionado(imagen);
    modalModificarImagen.abrir();
  };

  const handleAgregarImagen = () => {
    modalAgregarImagen.abrir();
  };

  const handleSolicitarEliminarImagen = (imagen) => {
    setImagenAEliminar(imagen);
    
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar la imagen del producto "${imagen.nombre_producto}"? Esta acción no se puede deshacer.`,
      () => {
        handleEliminarImagen(imagen.id_imagen_producto);
      },
      {
        titulo: "Eliminar Imagen",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const cancelarEliminacion = () => {
    setImagenAEliminar(null);
    confirmacionEliminar.ocultarConfirmacion();
  };

  const handleEliminarImagen = async (idImagenProducto) => {
    try {
      await eliminarImagenProductoServicio(idImagenProducto);
      
      refetch();
      mostrarAlerta.exito('Imagen eliminada correctamente');
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al eliminar la imagen';
      mostrarAlerta.error(mensajeError);
    } finally {
      setImagenAEliminar(null);
    }
  };

  const handleGuardar = () => {
    refetch();
    modalModificarImagen.cerrar();
    modalAgregarImagen.cerrar();
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FiImage className="mr-3 text-2xl text-gray-900 dark:text-white shrink-0" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Imágenes de Productos
            </h1>
          </div>
          <button
            onClick={handleAgregarImagen}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FiPlusCircle size={18} className="shrink-0"/>
            Agregar Imagen
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Modifica o elimina las imágenes de tus productos. Pasa el cursor sobre una imagen para ver las opciones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {imagenesProductos.map((imagen) => (
          <TarjetaProducto
            key={imagen.id_imagen_producto}
            imagen={imagen}
            onModificarImagen={handleModificarImagen}
            onEliminarImagen={handleSolicitarEliminarImagen}
          />
        ))}
      </div>

      <Modal
        estaAbierto={modalModificarImagen.estaAbierto}
        onCerrar={modalModificarImagen.cerrar}
        titulo={`Modificar Imagen: ${productoSeleccionado?.nombre_producto || ''}`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {productoSeleccionado && (
          <ModalModificarImagen
            producto={productoSeleccionado}
            onClose={modalModificarImagen.cerrar}
            onGuardar={handleGuardar}
          />
        )}
      </Modal>

      <Modal
        estaAbierto={modalAgregarImagen.estaAbierto}
        onCerrar={modalAgregarImagen.cerrar}
        titulo="Agregar Nueva Imagen a Producto"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalAgregarImagen
          onClose={modalAgregarImagen.cerrar}
          onGuardar={handleGuardar}
        />
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

export default GestionImagenesPagina;