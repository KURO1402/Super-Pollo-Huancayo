import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiImage, FiSearch } from 'react-icons/fi';
import { agregarImagenProductoServicio } from '../../../servicios/productoServicios';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import { useProductos } from '../../../hooks/useProductos';

export const ModalAgregarImagen = ({ onClose, onGuardar }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSelector, setMostrarSelector] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      imagen: null
    }
  });

  const { productos, cargando: cargandoProductos } = useProductos();

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formatosPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!formatosPermitidos.includes(file.type)) {
        mostrarAlerta.advertencia('Formato de imagen no válido. Solo se permiten PNG o JPG');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        mostrarAlerta.advertencia('La imagen es demasiado grande. Máximo 5MB permitido');
        e.target.value = '';
        return;
      }

      setValue('imagen', file);
    }
  };

  const handleSeleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarSelector(false);
  };

  const handleVolverSelector = () => {
    setProductoSeleccionado(null);
    setMostrarSelector(true);
    setValue('imagen', null);
  };

  const productosFiltrados = productos?.filter(producto => 
    producto.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion_producto?.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  const onSubmit = async (data) => {
    try {
      if (!productoSeleccionado) {
        mostrarAlerta.advertencia('Debe seleccionar un producto');
        return;
      }

      if (!data.imagen) {
        mostrarAlerta.advertencia('Debe seleccionar una imagen');
        return;
      }

      const formData = new FormData();
      formData.append('imagenProducto', data.imagen);

      await agregarImagenProductoServicio(productoSeleccionado.id_producto, formData);
      
      mostrarAlerta.exito('Imagen agregada correctamente');
      onGuardar();
      onClose();
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al agregar la imagen';
      mostrarAlerta.error(mensajeError);
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const imagenActual = watch('imagen');

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {mostrarSelector ? (
          // Selector de productos
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar Producto
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o descripción..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {cargandoProductos ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No se encontraron productos</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {productosFiltrados.map((producto) => (
                    <button
                      key={producto.id_producto}
                      type="button"
                      onClick={() => handleSeleccionarProducto(producto)}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-4"
                    >
                      {producto.url_imagen ? (
                        <img
                          src={producto.url_imagen}
                          alt={producto.nombre_producto}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48?text=No+Img';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FiImage className="text-gray-400" size={24} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {producto.nombre_producto}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {producto.descripcion_producto || 'Sin descripción'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Formulario de carga de imagen
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {productoSeleccionado?.url_imagen ? (
                    <img
                      src={productoSeleccionado.url_imagen}
                      alt={productoSeleccionado.nombre_producto}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64?text=No+Img';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <FiImage className="text-gray-400" size={32} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      {productoSeleccionado?.nombre_producto}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      ID: {productoSeleccionado?.id_producto}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleVolverSelector}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                  title="Cambiar producto"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Imagen *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".png,.jpg,.jpeg" 
                    onChange={handleImagenChange}
                  />
                </label>
              </div>
              
              {imagenActual && (
                <div className="mt-2 flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <FiImage className="text-green-600 dark:text-green-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        {imagenActual.name}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        {(imagenActual.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue('imagen', null)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          {!mostrarSelector && (
            <button
              type="submit"
              disabled={isSubmitting || !imagenActual}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Agregando...' : 'Agregar Imagen'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};