import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { crearMovimientoServicio } from '../../../servicios/movientosStockServicio';
import { listarInsumoServicio } from '../../../servicios/insumosServicios';
import { alertasCRUD } from '../../../utilidades/toastUtilidades';

export const ModalMovimientoStock = ({ onClose, onGuardar }) => {
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch
  } = useForm({
    defaultValues: {
      idInsumo: '',
      tipoMovimiento: 'entrada',
      cantidadMovimiento: '',
      detalle: '',
      fecha: '',
      hora: '',
    }
  });

  const [insumos, setInsumos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerInsumos = async () => {
    try {
      const respuesta = await listarInsumoServicio();
      setInsumos(respuesta?.data || respuesta || []);
    } catch (error) {
      alertasCRUD.error('Error al cargar los insumos');
      setInsumos([]); 
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    const horaActual = now.toTimeString().slice(0, 5);
    
    setValue('fecha', fechaActual);
    setValue('hora', horaActual);
    obtenerInsumos();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const movimientoData = {
        idInsumo: parseInt(data.idInsumo),
        tipoMovimiento: data.tipoMovimiento,
        cantidadMovimiento: parseFloat(data.cantidadMovimiento),
        detallesMovimiento: data.detalle || '',
      };
      
      await crearMovimientoServicio(movimientoData);
      
      alertasCRUD.creado();
      onGuardar(); 
      reset();
      onClose();
    } catch (error) {
      alertasCRUD.error('Error al registrar el movimiento');
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const tipoMovimiento = watch('tipoMovimiento');
  const insumoSeleccionado = watch('idInsumo');

  const insumoActual = insumos?.find(insumo => insumo.idInsumo === parseInt(insumoSeleccionado));

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Insumo *
          </label>
          <select
            {...register("idInsumo", { 
              required: "Seleccione un insumo",
              validate: value => value !== "" || "Seleccione un insumo"
            })}
            disabled={cargando}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.idInsumo 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">{cargando ? 'Cargando insumos...' : 'Seleccionar insumo...'}</option>
            {insumos?.map(insumo => (
              <option key={insumo.idInsumo} value={insumo.idInsumo}>
                {insumo.nombreInsumo} ({insumo.unidadMedida})
              </option>
            ))}
          </select>
          {errors.idInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.idInsumo.message}
            </p>
          )}
          
          {insumoActual && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Stock actual: <strong>{insumoActual.stockInsumo} {insumoActual.unidadMedida}</strong>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Categoría: {insumoActual.categoriaProducto === 'bebida' ? 'Bebida' : 'Insumo'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Movimiento *
            </label>
            <select
              {...register("tipoMovimiento", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="entrada">Entrada (+)</option>
              <option value="salida">Salida (-)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("cantidadMovimiento", { 
                required: "La cantidad es requerida",
                min: {
                  value: 0.01,
                  message: "La cantidad debe ser mayor a 0"
                },
                validate: {
                  stockSuficiente: (value) => {
                    if (tipoMovimiento === 'salida' && insumoActual) {
                      return parseFloat(value) <= insumoActual.stockInsumo || 
                        'No hay suficiente stock disponible';
                    }
                    return true;
                  }
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cantidadMovimiento 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.cantidadMovimiento && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cantidadMovimiento.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detalle (Opcional)
          </label>
          <textarea
            {...register("detalle")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Ingrese detalles adicionales sobre el movimiento (ej: motivo, proveedor, destino, etc.)"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Descripción opcional del movimiento
          </p>
        </div>

        {insumoActual && (
          <div className={`p-4 rounded-lg border ${
            tipoMovimiento === 'entrada' 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <h4 className={`font-semibold text-sm ${
              tipoMovimiento === 'entrada' 
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              Resumen del Movimiento:
            </h4>
            <div className="text-xs mt-1 space-y-1">
              <p className={tipoMovimiento === 'entrada' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                <strong>{tipoMovimiento === 'entrada' ? '+' : '-'}{watch('cantidadMovimiento') || '0'} {insumoActual?.unidadMedida}</strong> de {insumoActual?.nombreInsumo}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Stock actual: {insumoActual.stockInsumo} {insumoActual.unidadMedida} → 
                Stock nuevo: <strong>
                  {tipoMovimiento === 'entrada' 
                    ? (parseFloat(insumoActual.stockInsumo) + parseFloat(watch('cantidadMovimiento') || 0)).toFixed(2)
                    : (parseFloat(insumoActual.stockInsumo) - parseFloat(watch('cantidadMovimiento') || 0)).toFixed(2)
                  } {insumoActual.unidadMedida}
                </strong>
              </p>
              {watch('detalle') && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Detalle:</strong> {watch('detalle')}
                </p>
              )}
            </div>
          </div>
        )}

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
            disabled={isSubmitting || cargando}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Movimiento'}
          </button>
        </div>
      </form>
    </div>
  );
};