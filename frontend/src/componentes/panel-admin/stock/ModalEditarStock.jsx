import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import mostrarAlerta, { alertasCRUD } from '../../../utilidades/toastUtilidades';
import { actualizarInsumoServicio } from '../../../servicios/insumosServicios';

export const ModalEditarStock = ({ insumo, onClose, onGuardar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm();

  useEffect(() => {
    if (insumo) {
      const now = new Date();
      const fechaActual = now.toISOString().split('T')[0];
      
      setValue('nombreInsumo', insumo.nombreInsumo || '');
      setValue('stockInsumo', insumo.stockActual || insumo.stockInsumo || '');
      setValue('unidadMedida', insumo.unidadMedida || '');
      setValue('fechaActualizacion', fechaActual);
    }
  }, [insumo, setValue]);

  const onSubmit = async (data) => {
    
    try {
      const datosParaBackend = {
        nombreInsumo: data.nombreInsumo,
        cantidadInicial: parseFloat(data.stockInsumo).toFixed(2),
        unidadMedida: data.unidadMedida,
      };

      const resultado = await actualizarInsumoServicio(insumo.idInsumo, datosParaBackend);

      if (resultado && resultado.ok) {
        alertasCRUD.actualizado();
        
        const insumoActualizado = resultado.data?.data || {
          ...insumo,
          ...datosParaBackend,
          idInsumo: insumo.idInsumo
        };
        onGuardar(insumoActualizado);
      }
    } catch (error) {
      mostrarAlerta.error('Ya existe un insumo son el mismo nombre');
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const stockInsumo = watch('stockInsumo');
  const unidadMedida = watch('unidadMedida');
  const nombreInsumo = watch('nombreInsumo');
  const descripcion = watch('descripcion');

  const calcularEstadoStock = () => {
    const actual = parseFloat(stockInsumo) || 0;
    const stockMinimo = 5; 
    
    if (actual === 0) return 'Stock Agotado';
    if (actual <= stockMinimo * 0.3) return 'Stock Crítico';
    if (actual <= stockMinimo) return 'Stock Bajo';
    if (actual <= stockMinimo * 1.5) return 'Stock Normal';
    return 'Stock Óptimo';
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Stock Óptimo': return 'text-green-600 dark:text-green-400';
      case 'Stock Normal': return 'text-blue-600 dark:text-blue-400';
      case 'Stock Bajo': return 'text-yellow-600 dark:text-yellow-400';
      case 'Stock Crítico': return 'text-orange-600 dark:text-orange-400';
      case 'Stock Agotado': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getBgColorEstado = (estado) => {
    switch (estado) {
      case 'Stock Óptimo': return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'Stock Normal': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'Stock Bajo': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'Stock Crítico': return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
      case 'Stock Agotado': return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
    }
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

  if (!insumo) return null;

  const estadoActual = calcularEstadoStock();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          Editando Insumo: <span className="text-blue-900 dark:text-blue-100">{insumo.nombreInsumo}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Stock Actual:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200 font-medium">
              {insumo.stockActual || insumo.stockInsumo} {insumo.unidadMedida}
            </span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">ID:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200">{insumo.idInsumo}</span>
          </div>
        </div>
      </div>

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
            placeholder="Ingrese el nombre del insumo"
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
                required: "La unidad de medida es requerida"
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unidadMedida 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Seleccionar unidad...</option>
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
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("stockInsumo", { 
                  required: "El stock actual es requerido",
                  min: {
                    value: 0,
                    message: "El stock no puede ser negativo"
                  },
                  validate: value => {
                    const numValue = parseFloat(value);
                    return !isNaN(numValue) || "El stock debe ser un número válido";
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stockInsumo 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
              />
              {unidadMedida && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {unidadMedida}
                  </span>
                </div>
              )}
            </div>
            {errors.stockInsumo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.stockInsumo.message}
              </p>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getBgColorEstado(estadoActual)}`}>
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Estado del Stock:
              </h4>
              <p className={`text-lg font-bold ${getColorEstado(estadoActual)}`}>
                {estadoActual}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Stock actual: <span className="font-medium">{stockInsumo || 0}</span> {unidadMedida || 'unidades'}
                {estadoActual !== 'Stock Agotado' && (
                  <span className="ml-3">
                    • Mínimo recomendado: <span className="font-medium">5</span> {unidadMedida || 'unidades'}
                  </span>
                )}
              </p>
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
            className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Actualizando...
              </>
            ) : (
              'Actualizar Insumo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};