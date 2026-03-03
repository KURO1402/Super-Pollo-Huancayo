import { useForm } from "react-hook-form";
import { useState } from "react";
import { FiBarChart2, FiDollarSign, FiCreditCard, FiSmartphone, FiPackage, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";

const ModalArqueo = ({ estaAbierto, onCerrar, onRegistrarArqueo, saldoActual }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      montoFisico: 0,
      montoTarjeta: 0,
      montoBilleteraDigital: 0,
      otros: 0,
      descripcionArqueo: ""
    }
  });
  const [confirmarDiferencia, setConfirmarDiferencia] = useState(false);
  const [datosPendientes, setDatosPendientes] = useState(null);

  const montos = watch();
  const totalArqueo = (
    (parseFloat(montos.montoFisico) || 0) +
    (parseFloat(montos.montoTarjeta) || 0) +
    (parseFloat(montos.montoBilleteraDigital) || 0) +
    (parseFloat(montos.otros) || 0)
  );
  const diferencia = totalArqueo - (parseFloat(saldoActual) || 0);
  const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';

  const onSubmit = (data) => {
    if (estadoArqueo !== 'cuadra') {
      setDatosPendientes(data);
      setConfirmarDiferencia(true);
      return;
    }
    onRegistrarArqueo(data);
    reset();
  };

  const onRecontarDinero = () => {
    setConfirmarDiferencia(false);
    setDatosPendientes(null);
  };

  const onConfirmarRegistro = () => {
    onRegistrarArqueo(datosPendientes);
    setConfirmarDiferencia(false);
    setDatosPendientes(null);
    reset();
  };

  const handleCancelar = () => {
    reset();
    setConfirmarDiferencia(false);
    setDatosPendientes(null);
    onCerrar();
  };

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={handleCancelar}
      titulo="Realizar Arqueo de Caja"
      tamaño="lg"
      mostrarHeader
      mostrarFooter={false}
    >
      {confirmarDiferencia ? (
        /* ── PASO CONFIRMACIÓN ── */
        <div className="p-6 space-y-6">
          <div className={`p-5 rounded-lg border text-center ${
            estadoArqueo === 'sobra'
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <FiAlertTriangle className={`mx-auto w-10 h-10 mb-2 ${
              estadoArqueo === 'sobra' ? 'text-blue-500' : 'text-red-500'
            }`} />
            <p className="font-semibold text-gray-900 dark:text-white text-lg">
              {estadoArqueo === 'sobra' ? '¡Hay un sobrante!' : '¡Hay un faltante!'}
            </p>
            <p className={`text-2xl font-bold mt-1 ${
              estadoArqueo === 'sobra' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Te recomendamos volver a contar el dinero antes de registrar. ¿Deseas recontabilizar o registrar de todas formas?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onRecontarDinero}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Recontabilizar dinero
            </button>
            <button
              type="button"
              onClick={onConfirmarRegistro}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors ${
                estadoArqueo === 'sobra' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              <FiBarChart2 className="w-4 h-4" />
              Registrar de todas formas
            </button>
          </div>
        </div>
      ) : (
        /* ── FORMULARIO ── */
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Efectivo Físico</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number" step="0.01" min="0"
                  {...register("montoFisico", {
                    required: "El monto en efectivo es requerido",
                    min: { value: 0, message: "El monto no puede ser negativo" },
                    valueAsNumber: true
                  })}
                  className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.montoFisico && <p className="text-sm text-red-600 dark:text-red-400">{errors.montoFisico.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tarjetas</label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number" step="0.01" min="0"
                  {...register("montoTarjeta", {
                    required: "El monto en tarjetas es requerido",
                    min: { value: 0, message: "El monto no puede ser negativo" },
                    valueAsNumber: true
                  })}
                  className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.montoTarjeta && <p className="text-sm text-red-600 dark:text-red-400">{errors.montoTarjeta.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billetera Digital</label>
              <div className="relative">
                <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number" step="0.01" min="0"
                  {...register("montoBilleteraDigital", {
                    required: "El monto en billetera digital es requerido",
                    min: { value: 0, message: "El monto no puede ser negativo" },
                    valueAsNumber: true
                  })}
                  className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.montoBilleteraDigital && <p className="text-sm text-red-600 dark:text-red-400">{errors.montoBilleteraDigital.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Otros Medios</label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number" step="0.01" min="0"
                  {...register("otros", {
                    required: "El monto en otros medios es requerido",
                    min: { value: 0, message: "El monto no puede ser negativo" },
                    valueAsNumber: true
                  })}
                  className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.otros && <p className="text-sm text-red-600 dark:text-red-400">{errors.otros.message}</p>}
            </div>
          </div>

          {/* ── RESUMEN ── */}
          <div className={`p-4 rounded-lg border mb-4 ${
            estadoArqueo === 'cuadra' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
            estadoArqueo === 'sobra' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Arqueo:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{totalArqueo.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Saldo Sistema:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{(parseFloat(saldoActual) || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Diferencia:</p>
                <p className={`font-semibold ${
                  estadoArqueo === 'cuadra' ? 'text-green-600 dark:text-green-400' :
                  estadoArqueo === 'sobra' ? 'text-blue-600 dark:text-blue-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Estado:</p>
                <p className={`font-semibold capitalize ${
                  estadoArqueo === 'cuadra' ? 'text-green-600 dark:text-green-400' :
                  estadoArqueo === 'sobra' ? 'text-blue-600 dark:text-blue-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {estadoArqueo}
                </p>
              </div>
            </div>
          </div>

          {/* ── DESCRIPCIÓN (siempre opcional) ── */}
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={3}
              {...register("descripcionArqueo")}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200"
            >
              <FiBarChart2 className="w-4 h-4" />
              Registrar Arqueo
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ModalArqueo;