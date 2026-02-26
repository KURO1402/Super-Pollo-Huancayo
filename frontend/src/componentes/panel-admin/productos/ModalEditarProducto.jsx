import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import { actualizarProductoServicio } from '../../../servicios/productoServicios';
import { useCategorias } from '../../../hooks/useCategorias';

export const ModalEditarProducto = ({ producto, onClose, onGuardar }) => {
  const { categorias, loading: cargandoCategorias, cargarCategorias } = useCategorias();
  const [categoriasCargadas, setCategoriasCargadas] = useState(false);
  const {
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      nombreProducto: producto.nombre_producto,
      descripcionProducto: producto.descripcion_producto,
      precio: parseFloat(producto.precio_producto),
      idCategoria: producto.id_categoria
    }
  });

  useEffect(() => {
    const inicializar = async () => {
      if (!categoriasCargadas) {
        await cargarCategorias();
        setCategoriasCargadas(true);
      }
    };
    
    inicializar();
  }, [cargarCategorias, categoriasCargadas]);

  useEffect(() => {
    if (categoriasCargadas && categorias.length > 0 && producto.nombre_categoria) {
      const categoriaEncontrada = categorias.find(
        cat => cat.nombre_categoria === producto.nombre_categoria
      );
      
      if (categoriaEncontrada) {
        setValue('idCategoria', categoriaEncontrada.id_categoria);
      }
    }
  }, [categoriasCargadas, categorias, producto.id_categoria, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!data.idCategoria) {
        mostrarAlerta.advertencia('Debe seleccionar una categoría para el producto');
        return;
      }

      const datosActualizados = {
        nombreProducto: data.nombreProducto,
        descripcionProducto: data.descripcionProducto,
        precioProducto: Number(data.precio),
        idCategoria: Number(data.idCategoria),
      };

      await actualizarProductoServicio(producto.id_producto, datosActualizados);

      mostrarAlerta.exito('Producto actualizado exitosamente');
      onGuardar();

    } catch (error) {
      mostrarAlerta.error("No se pudo actualizar el producto");
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            {...register("nombreProducto", { 
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreProducto 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Pollo a la Brasa 1/4"
          />
          {errors.nombreProducto && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.nombreProducto.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoría del Producto *
          </label>
          <select
            {...register("idCategoria", { 
              required: "La categoría es requerida"
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.idCategoria 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {cargandoCategorias ? (
              <option value="" disabled>Cargando categorías...</option>
            ) : (
              categorias.map(categoria => (
                <option 
                  key={categoria.id_categoria} 
                  value={categoria.id_categoria}
                >
                  {categoria.nombre_categoria}
                </option>
              ))
            )}
          </select>
          {errors.idCategoria && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.idCategoria.message}
            </p>
          )}
          {producto.nombre_categoria && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Categoría actual: <strong>{producto.nombre_categoria}</strong>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Precio de Venta (S/) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("precio", { 
              required: "El precio es requerido",
              min: {
                value: 0.01,
                message: "El precio debe ser mayor a 0"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.precio 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.precio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción del Producto
          </label>
          <textarea
            {...register("descripcionProducto")}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe brevemente el producto..."
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Información del Producto
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-700 dark:text-blue-400">ID:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">{producto.id_producto}</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-400">Usa Insumos:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">
                {producto.usaInsumos === 1 ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-blue-700 dark:text-blue-400">Categoría Actual:</span>
              <span className="ml-1 text-blue-900 dark:text-blue-200">
                {producto.nombre_categoria || 'Sin categoría'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};