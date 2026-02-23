import { useForm } from "react-hook-form";
import { FiMinus } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";

const ModalEgreso = ({ estaAbierto, onCerrar, onRegistrarEgreso }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onRegistrarEgreso(data);
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
      titulo="Registrar Egreso"
      tamaño="md"
      mostrarHeader
      mostrarFooter={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("monto", { 
                required: "El monto es requerido",
                min: { value: 0.01, message: "El monto debe ser mayor a 0" }
              })}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
              placeholder="0.00"
            />
            {errors.monto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.monto.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción *
            </label>
            <textarea
              {...register("descripcion", { 
                required: "La descripción es requerida",
                minLength: { value: 5, message: "La descripción debe tener al menos 5 caracteres" }
              })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
              placeholder="Describe el destino de este egreso..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.descripcion.message}
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
            className="flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
          >
            <FiMinus className="w-4 h-4" />
            Registrar Egreso
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalEgreso;