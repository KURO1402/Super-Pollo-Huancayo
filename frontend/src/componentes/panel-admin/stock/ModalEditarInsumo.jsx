import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import mostrarAlerta, { alertasCRUD } from '../../../utilidades/toastUtilidades';
import { actualizarInsumoServicio } from '../../../servicios/insumosServicios';

export const ModalEditarInsumo = ({ insumo, onClose, onGuardar }) => {
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

  const normalizar = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    reset, watch, setValue
  } = useForm({
    defaultValues: {
      nombreInsumo: '',
      unidadMedida: '',
    }
  });

  const unidadMedida = watch('unidadMedida');

  useEffect(() => {
    if (!insumo) return;

    const unidadNormalizada = normalizar(insumo.unidad_medida);
    const enLista = unidadesMedida.some(u => u.value === unidadNormalizada);

    if (enLista) {
      setUnidadPersonalizada(false);
      reset({
        nombreInsumo: insumo.nombre_insumo || '',
        unidadMedida: unidadNormalizada,
      });
    } else {
      setUnidadPersonalizada(true);
      reset({
        nombreInsumo: insumo.nombre_insumo || '',
        unidadMedida: insumo.unidad_medida || '',
      });
    }
  }, [insumo?.id_insumo]);

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

  const onSubmit = async (data) => {
    try {
      const resultado = await actualizarInsumoServicio(insumo.id_insumo, {
        nombreInsumo: data.nombreInsumo,
        unidadMedida: data.unidadMedida,
      });
      if (resultado && resultado.ok) {
        alertasCRUD.actualizado();
        onGuardar(resultado.insumo || { ...insumo, nombre_insumo: data.nombreInsumo, unidad_medida: data.unidadMedida });
      }
    } catch (error) {
      mostrarAlerta.error('Ya existe un insumo con el mismo nombre');
    }
  };

  const handleCancelar = () => {
    reset();
    setUnidadPersonalizada(false);
    onClose();
  };

  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));

  const formatearCantidad = (valor) => {
    const num = parseFloat(valor) || 0;
    const entero = Math.floor(num);
    const decimal = Math.round((num - entero) * 100);
    if (decimal === 0) return <span>{entero}</span>;
    const divisor = mcd(decimal, 100);
    const numerador = decimal / divisor;
    const denominador = 100 / divisor;
    const fraccion = `${numerador}/${denominador}`;
    return (
      <span>
        {entero > 0 ? `${entero} ${fraccion}` : fraccion}
      </span>
    );
  };

  const pluralizarUnidad = (unidad, cantidad) => {
    if (!unidad) return '';
    const num = parseFloat(cantidad) || 0;
    const aSingular = {
      'kilogramos': 'Kilogramo', 'gramos': 'Gramo', 'litros': 'Litro',
      'mililitros': 'Mililitro', 'unidades': 'Unidad', 'paquetes': 'Paquete', 'cajas': 'Caja',
      'kilogramo': 'Kilogramo', 'gramo': 'Gramo', 'litro': 'Litro',
      'mililitro': 'Mililitro', 'unidad': 'Unidad', 'paquete': 'Paquete', 'caja': 'Caja',
    };
    const aPlural = {
      'kilogramo': 'Kilogramos', 'gramo': 'Gramos', 'litro': 'Litros',
      'mililitro': 'Mililitros', 'unidad': 'Unidades', 'paquete': 'Paquetes', 'caja': 'Cajas',
      'kilogramos': 'Kilogramos', 'gramos': 'Gramos', 'litros': 'Litros',
      'mililitros': 'Mililitros', 'unidades': 'Unidades', 'paquetes': 'Paquetes', 'cajas': 'Cajas',
    };
    const key = unidad.toLowerCase();
    if (num === 1) return aSingular[key] || unidad;
    return aPlural[key] || unidad;
  };

  if (!insumo) return null;

  const stockOriginal = insumo.stock_insumo;
  const unidadOriginal = insumo.unidad_medida;

  const valorSelect = unidadPersonalizada
    ? '__otro__'
    : (unidadesMedida.some(u => u.value === unidadMedida) ? unidadMedida : '');

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          Editando: <span className="text-blue-900 dark:text-blue-100">{insumo.nombre_insumo}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Stock actual:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200 font-medium">
              {formatearCantidad(stockOriginal)} {pluralizarUnidad(unidadOriginal, stockOriginal)}
            </span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">ID:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200">{insumo.id_insumo}</span>
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
              minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" }
            })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nombreInsumo ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingrese el nombre del insumo"
          />
          {errors.nombreInsumo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreInsumo.message}</p>
          )}
        </div>

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

        <div className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">Stock actual:</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatearCantidad(stockOriginal)}
            </span>{' '}
            {pluralizarUnidad(unidadOriginal, stockOriginal)}
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              · Para modificarlo usa Entrada o Salida
            </span>
          </p>
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
            ) : 'Actualizar Insumo'}
          </button>
        </div>
      </form>
    </div>
  );
};