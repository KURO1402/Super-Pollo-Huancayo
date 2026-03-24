import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { crearProductoServicio } from '../../../servicios/productoServicios';
import { useCategorias } from '../../../hooks/useCategorias';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import BuscadorInsumo from './BuscadorInsumo';

export const ModalNuevoProducto = ({ onClose, onGuardar }) => {
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);

  const { categorias, loading: cargandoCategorias, cargarCategorias } = useCategorias();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      nombreProducto: '',
      precio: '',
      descripcionProducto: '',
      usaInsumo: false,
      imagen: null,
      idCategoria: ''
    }
  });

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const handleCancelar = () => {
    reset();
    setInsumosSeleccionados([]);
    onClose();
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formatosPermitidos = ['image/png', 'image/jpeg'];
      if (!formatosPermitidos.includes(file.type)) {
        mostrarAlerta.advertencia('Formato de imagen no válido. Solo se permiten PNG o JPEG');
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

  const agregarInsumo = () => {
    setInsumosSeleccionados(prev => [...prev, { insumo: null, cantidad: '' }]);
  };

  const eliminarInsumo = (index) => {
    setInsumosSeleccionados(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarInsumo = (index, campo, valor) => {
    setInsumosSeleccionados(prev => {
      const nuevos = [...prev];
      nuevos[index] = { ...nuevos[index], [campo]: valor };
      return nuevos;
    });
  };

  const imagenActual = watch('imagen');
  const usaInsumo = watch('usaInsumo');

  const onSubmit = async (data) => {
    try {
      if (!data.imagen) {
        mostrarAlerta.advertencia('La imagen del producto es requerida');
        return;
      }

      if (data.usaInsumo) {
        if (insumosSeleccionados.length === 0) {
          mostrarAlerta.advertencia('Debe agregar al menos un insumo cuando activa "usa sistema de insumos"');
          return;
        }
        const insumosInvalidos = insumosSeleccionados.some(i =>
          !i.insumo || !i.cantidad || parseFloat(i.cantidad) <= 0
        );
        if (insumosInvalidos) {
          mostrarAlerta.advertencia('Todos los insumos deben tener un insumo seleccionado y cantidad válida');
          return;
        }
      }

      const formData = new FormData();
      formData.append('imagenProducto', data.imagen);

      const datosProducto = {
        nombreProducto: data.nombreProducto,
        descripcionProducto: data.descripcionProducto || '',
        precioProducto: parseFloat(data.precio),
        idCategoria: parseInt(data.idCategoria),
        usaInsumos: data.usaInsumo ? 1 : 0,
        insumos: data.usaInsumo
          ? insumosSeleccionados
              .filter(i => i.insumo && i.cantidad)
              .map(i => ({
                idInsumo: i.insumo.id_insumo,
                cantidadUso: parseFloat(i.cantidad)
              }))
          : []
      };

      formData.append('datos', JSON.stringify(datosProducto));
      await crearProductoServicio(formData);

      mostrarAlerta.exito('Producto creado exitosamente');
      onGuardar();
      reset();
      setInsumosSeleccionados([]);

    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al crear el producto');
    }
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
              minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreProducto ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Pollo a la Brasa 1/4"
          />
          {errors.nombreProducto && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreProducto.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoría del Producto *
          </label>
          <select
            {...register("idCategoria", { required: "La categoría es requerida" })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.idCategoria ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {cargandoCategorias ? (
              <option disabled>Cargando categorías...</option>
            ) : (
              categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_categoria}
                </option>
              ))
            )}
          </select>
          {errors.idCategoria && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.idCategoria.message}</p>
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
              min: { value: 0.01, message: "El precio debe ser mayor a 0" }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.precio ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.precio.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Este producto usa sistema de insumos?
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Activa esta opción si el producto requiere ingredientes específicos
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register("usaInsumo")} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {usaInsumo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                Insumos del Producto
              </h3>
              <button
                type="button"
                onClick={agregarInsumo}
                className="flex items-center cursor-pointer gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiPlus size={16} />
                Agregar Insumo
              </button>
            </div>

            {insumosSeleccionados.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiPlus size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay insumos agregados</p>
                <p className="text-sm">Haz clic en "Agregar Insumo" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {insumosSeleccionados.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Insumo *
                        </label>
                        <BuscadorInsumo
                          value={item.insumo}
                          onChange={(insumo) => actualizarInsumo(index, 'insumo', insumo)}
                          placeholder="Buscar insumo..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.cantidad}
                          onChange={(e) => actualizarInsumo(index, 'cantidad', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarInsumo(index)}
                      className="mt-5 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen del Producto *
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG o JPEG (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleImagenChange} />
            </label>
          </div>
          {imagenActual && (
            <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div>
                <span className="text-sm text-green-700 dark:text-green-300">{imagenActual.name}</span>
                <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                  ({(imagenActual.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button type="button" onClick={() => setValue('imagen', null)} className="text-red-500 hover:text-red-700">
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};