import { useForm } from "react-hook-form";
import Modal from "../../ui/modal/Modal";
import mostrarAlerta from '../../../utilidades/toastUtilidades'

const ModalAbrirCaja = ({ estaAbierto, onCerrar, onAbrirCaja }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onAbrirCaja(data);
    mostrarAlerta.exito('Caja abierta con éxito')
    reset();
  };

  const handleCancelar = () => {
    reset();
    onCerrar();
  };

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={handleCancelar}
      titulo="Abrir Nueva Caja"
      tamaño="md"
      mostrarHeader
      mostrarFooter={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Saldo Inicial *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("montoInicial", { 
                required: "El monto inicial es requerido",
                min: { value: 0.1, message: "El monto debe ser mayor a 0" }
              })}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="0.00"
            />
            {errors.montoInicial && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.montoInicial.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancelar}
            className="px-6 py-2.5 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 cursor-pointer bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            Abrir Caja
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAbrirCaja;