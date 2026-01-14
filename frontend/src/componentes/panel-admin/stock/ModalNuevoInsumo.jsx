// librerías externas
import { useForm } from 'react-hook-form';
import { alertasCRUD } from '../../../utilidades/toastUtilidades';
import { crearInsumoServicio } from '../../../servicios/insumosServicios';

export const ModalNuevoInsumo = ({ onClose, onGuardar }) => { 
  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm({
    defaultValues: {
      nombreInsumo: '',
      unidadMedida: '',
      cantidadInicial: '',
    }
  });
  const onSubmit = async (data) => {
    const cantidadInicialDecimal = parseFloat(data.cantidadInicial);

    if (isNaN(cantidadInicialDecimal)) {
      alertasCRUD.error('El valor de stock no es válido');
      return;
    }
    data.cantidadInicial = cantidadInicialDecimal;

    try {
      await crearInsumoServicio(data);
      onGuardar();
      reset();
      alertasCRUD.creado()
    } catch (error) {
      alertasCRUD.error("Error al crear el insumo");
    }
  };
  const handleCancelar = () => {
    reset();
    onClose();
  };

  const unidadesMedida = [
    { value: '', label: 'Seleccionar unidad' },
    { value: 'Kilogramos', label: 'Kilogramos (kg)' },
    { value: 'Gramos', label: 'Gramos (g)' },
    { value: 'Litros', label: 'Litros (l)' },
    { value: 'Mililitros', label: 'Mililitros (ml)' },
    { value: 'Unidades', label: 'Unidades' },
    { value: 'Paquetes', label: 'Paquetes' },
    { value: 'Cajas', label: 'Cajas' }
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Insumo *
          </label>
          <input
            type="text"
            {...register("nombreInsumo", { 
              required: "El nombre es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreInsumo 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Pollo entero, Papas, Coca Cola"
          />
          {errors.nombreInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.nombreInsumo.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad de Medida *
            </label>
            <select
              {...register("unidadMedida", { 
                required: "La unidad de medida es requerida",
                validate: value => value !== "" || "Seleccione una unidad"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unidadMedida 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {unidadesMedida.map(unidad => (
                <option key={unidad.value} value={unidad.value}>
                  {unidad.label}
                </option>
              ))}
            </select>
            {errors.unidadMedida && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.unidadMedida.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Actual *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("cantidadInicial", { 
                required: "El stock actual es requerido",
                min: {
                  value: 0,
                  message: "El stock no puede ser negativo"
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cantidadInicial 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.cantidadInicial && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cantidadInicial.message}
              </p>
            )}
        </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            {...register("descripcion")}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Descripción adicional del insumo..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium cursor-pointer"
          >
            Guardar Insumo
          </button>
        </div>
      </form>
    </div>
  );
};