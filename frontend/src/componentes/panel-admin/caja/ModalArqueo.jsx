import { useForm } from "react-hook-form";
import { FiBarChart2, FiDollarSign, FiCreditCard, FiSmartphone, FiPackage } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";

const ModalArqueo = ({ estaAbierto, onCerrar, onRegistrarArqueo, saldoActual }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onRegistrarArqueo(data);
    reset();
  };

  const handleCancelar = () => {
    reset();
    onCerrar();
  };

  const montos = watch();
  const totalArqueo = (
    (parseFloat(montos.montoFisico) || 0) +
    (parseFloat(montos.montoTarjeta) || 0) +
    (parseFloat(montos.montoBilleteraDigital) || 0) +
    (parseFloat(montos.otros) || 0)
  );
  const diferencia = totalArqueo - saldoActual;
  const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={handleCancelar}
      titulo="Realizar Arqueo de Caja"
      tamaño="lg"
      mostrarHeader
      mostrarFooter={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Efectivo Físico
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("montoFisico", { 
                  required: "El monto en efectivo es requerido",
                  min: { value: 0, message: "El monto no puede ser negativo" },
                  valueAsNumber: true
                })}
                className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.montoFisico && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.montoFisico.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tarjetas
            </label>
            <div className="relative">
              <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("montoTarjeta", { 
                  required: "El monto en tarjetas es requerido",
                  min: { value: 0, message: "El monto no puede ser negativo" },
                  valueAsNumber: true
                })}
                className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.montoTarjeta && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.montoTarjeta.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Billetera Digital
            </label>
            <div className="relative">
              <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("montoBilleteraDigital", { 
                  required: "El monto en billetera digital es requerido",
                  min: { value: 0, message: "El monto no puede ser negativo" },
                  valueAsNumber: true
                })}
                className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.montoBilleteraDigital && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.montoBilleteraDigital.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Otros Medios
            </label>
            <div className="relative">
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("otros", { 
                  required: "El monto en otros medios es requerido",
                  min: { value: 0, message: "El monto no puede ser negativo" },
                  valueAsNumber: true
                })}
                className="w-full h-11 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.otros && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.otros.message}</p>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
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
              <p className="font-semibold text-gray-900 dark:text-white">{saldoActual}</p>
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

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
    </Modal>
  );
};

export default ModalArqueo;