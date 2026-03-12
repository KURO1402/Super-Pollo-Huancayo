import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { alertasCRUD } from '../../../utilidades/toastUtilidades';
import { crearInsumoServicio } from '../../../servicios/insumosServicios';

export const ModalNuevoInsumo = ({ onClose, onGuardar }) => {
  const [unidadPersonalizada, setUnidadPersonalizada] = useState(false);

  const unidadesMedida = [
    { value: 'Kilogramo', label: 'Kilogramo (kg)' },
    { value: 'Gramo', label: 'Gramo (g)' },
    { value: 'Litro', label: 'Litro (l)' },
    { value: 'Mililitro', label: 'Mililitro (ml)' },
    { value: 'Unidad', label: 'Unidad' },
    { value: 'Paquete', label: 'Paquete' },
    { value: 'Caja', label: 'Caja' },
  ];

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    reset, watch, setValue
  } = useForm({
    defaultValues: {
      nombreInsumo: '',
      unidadMedida: '',
      cantidadInicial: 0,
    }
  });

  const unidadMedida = watch('unidadMedida');

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__otro__') {
      setUnidadPersonalizada(true);
      setValue('unidadMedida', '');
    } else {
      setUnidadPersonalizada(false);
      setValue('unidadMedida', val);
    }
  };

  const valorSelect = unidadPersonalizada
    ? '__otro__'
    : (unidadesMedida.some(u => u.value === unidadMedida) ? unidadMedida : '');

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
      setUnidadPersonalizada(false);
      alertasCRUD.creado();
    } catch (error) {
      alertasCRUD.error("Error al crear el insumo");
    }
  };

  const handleCancelar = () => {
    reset();
    setUnidadPersonalizada(false);
    onClose();
  };

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
              minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreInsumo ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Pollo entero, Papas, Coca Cola"
          />
          {errors.nombreInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreInsumo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad de Medida *
            </label>

            <select
              value={valorSelect}
              onChange={handleSelectChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unidadMedida ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleccionar unidad...</option>
              {unidadesMedida.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
              <option value="__otro__">Otro...</option>
            </select>

            <input type="hidden" {...register("unidadMedida", { required: "La unidad de medida es requerida" })} />

            {unidadPersonalizada && (
              <input
                type="text"
                value={unidadMedida}
                onChange={(e) => setValue('unidadMedida', e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe la unidad de medida..."
                autoFocus
              />
            )}

            {errors.unidadMedida && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unidadMedida.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Actual *
            </label>
            <input
              type="number"
              step="0.50"
              min="0"
              {...register("cantidadInicial", {
                required: "El stock actual es requerido",
                min: { value: 0, message: "El stock no puede ser negativo" }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cantidadInicial ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.cantidadInicial && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cantidadInicial.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : 'Guardar Insumo'}
          </button>
        </div>
      </form>
    </div>
  );
};