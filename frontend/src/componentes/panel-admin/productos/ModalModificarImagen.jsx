import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { actualizarImagenProductoServicio } from '../../../servicios/productoServicios';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import { useProductos } from '../../../hooks/useProductos';

export const ModalModificarImagen = ({ producto, onClose, onGuardar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      imagen: null
    }
  });

  const { refetch } = useProductos();

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formatosPermitidos = ['image/png', 'image/jpeg'];
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

  const onSubmit = async (data) => {
    try {
      if (!data.imagen) {
        mostrarAlerta.advertencia('Debe seleccionar una nueva imagen');
        return;
      }

      const formData = new FormData();
      formData.append('imagenProducto', data.imagen);
      await actualizarImagenProductoServicio(producto.id_imagen_producto, formData);
      
      mostrarAlerta.exito('Imagen actualizada correctamente');
      await refetch()
      onGuardar();
      onClose();
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al actualizar la imagen';
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <img
              src={producto.url_imagen}
              alt={producto.nombre_producto}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/64?text=IMG';
              }}
            />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                {producto.nombre_producto}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                ID: {producto.id_imagen_producto}
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen Actual
          </label>
          <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <img
              src={producto.url_imagen}
              alt={`Imagen actual de ${producto.nombre_producto}`}
              className="max-h-64 max-w-full rounded-lg object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible';
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nueva Imagen *
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
          
          {errors.imagen && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.imagen.message}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !imagenActual}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Imagen'}
          </button>
        </div>
      </form>
    </div>
  );
};