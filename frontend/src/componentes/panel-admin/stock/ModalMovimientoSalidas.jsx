import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { registrarSalidaServicio } from '../../../servicios/movientosStockServicio';
import { listarInsumoServicio } from '../../../servicios/insumosServicios';
import {alertasCRUD} from '../../../utilidades/toastUtilidades';

export const ModalMovimientoSalidas = ({ onClose, onGuardar }) => {
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch
  } = useForm({
    defaultValues: {
      idInsumo: '',
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
      const primeraRespuesta = await listarInsumoServicio({ limit: 1, offset: 0 });
      const total = primeraRespuesta?.cantidad_filas || 10;
  
      const respuesta = await listarInsumoServicio({ limit: total, offset: 0 });
      const data = respuesta?.insumos || [];
      
      setInsumos(Array.isArray(data) ? data : []);
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
        cantidadMovimiento: parseFloat(data.cantidadMovimiento),
        detalleMovimiento: data.detalle || '',
      };
      await registrarSalidaServicio(movimientoData);
      alertasCRUD.creado('Salida');
      onGuardar(); 
      reset();
      onClose();
    } catch (error) {
      alertasCRUD.error('Error al registrar la salida');
    }
  };

  const handleCancelar = () => {
    reset();
    onClose();
  };

  const insumoSeleccionado = watch('idInsumo');
  const insumoActual = insumos?.find(insumo => insumo.id_insumo === parseInt(insumoSeleccionado));

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
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.idInsumo 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">{cargando ? 'Cargando insumos...' : 'Seleccionar insumo...'}</option>
            {insumos?.map(insumo => (
              <option key={insumo.id_insumo} value={insumo.id_insumo}>
                {insumo.nombre_insumo}
              </option>
            ))}
          </select>
          {errors.idInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.idInsumo.message}
            </p>
          )}
          
          {insumoActual && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-300">
                Stock actual: <strong>{insumoActual.stock_insumo || insumoActual.stockInsumo} {insumoActual.unidad_medida}</strong>
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Categoría: {insumoActual.categoriaProducto === 'bebida' ? 'Bebida' : 'Insumo'}
              </p>
            </div>
          )}
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
                  if (insumoActual) {
                    return parseFloat(value) <= (insumoActual.stock_insumo || insumoActual.stockInsumo) || 
                      'No hay suficiente stock disponible';
                  }
                  return true;
                }
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detalle (Opcional)
          </label>
          <textarea
            {...register("detalle")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Ingrese detalles adicionales (ej: motivo, destino, pedido, etc.)"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Descripción opcional de la salida
          </p>
        </div>

        {insumoActual && (
          <div className="p-4 rounded-lg border bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <h4 className="font-semibold text-sm text-red-800 dark:text-red-300">
              Resumen de la Salida:
            </h4>
            <div className="text-xs mt-1 space-y-1">
              <p className="text-red-700 dark:text-red-400">
                <strong>-{watch('cantidadMovimiento') || '0'} {insumoActual?.unidad_medida}</strong> de {insumoActual?.nombre_insumo}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Stock actual: {insumoActual.stock_insumo || insumoActual.stockInsumo} {insumoActual.unidad_medida} → 
                Stock nuevo: <strong>
                  {(parseFloat(insumoActual.stock_insumo || insumoActual.stockInsumo) - parseFloat(watch('cantidadMovimiento') || 0)).toFixed(2)} {insumoActual.unidad_medida}
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Salida'}
          </button>
        </div>
      </form>
    </div>
  );
};