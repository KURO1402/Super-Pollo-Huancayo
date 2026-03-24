import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import Modal from '../../ui/modal/Modal';

const ModalCategoria = ({ 
  estaAbierto, 
  onCerrar, 
  onGuardar, 
  categoriaEditar, 
  loading,
  categoriasExistentes = []
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreCategoria: ""
    }
  });

  const nombreActual = watch("nombreCategoria");

  useEffect(() => {
    if (estaAbierto) {
      const nombreInicial = categoriaEditar?.nombreCategoria || "";
      reset({ nombreCategoria: nombreInicial });
    }
  }, [estaAbierto, categoriaEditar, reset]);

  const validarNombreUnico = (nombre) => {
    if (!nombre || nombre.trim().length < 2) return true;
    
    const nombreNormalizado = nombre.trim().toLowerCase();
    const categoriasParaValidar = categoriasExistentes.filter(
      cat => cat.idCategoria !== categoriaEditar?.idCategoria
    );
    
    const existeDuplicado = categoriasParaValidar.some(
      cat => cat.nombreCategoria.toLowerCase() === nombreNormalizado
    );
    
    return !existeDuplicado || "Ya existe una categoría con este nombre";
  };

  const onSubmit = (data) => {
    onGuardar(data.nombreCategoria.trim());
  };

  const handleCerrar = () => {
    reset();
    onCerrar();
  };

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={handleCerrar}
      titulo={categoriaEditar ? "Editar Categoría" : "Nueva Categoría"}
      tamaño="md"
      mostrarHeader={true}
      mostrarFooter={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de Categoría
          </label>
          <input
            type="text"
            id="nombreCategoria"
            {...register("nombreCategoria", {
              required: "El nombre de la categoría es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres"
              },
              maxLength: {
                value: 50,
                message: "El nombre no puede tener más de 50 caracteres"
              },
              validate: {
                noSoloEspacios: (value) => 
                  value.trim().length > 0 || "El nombre no puede contener solo espacios",
                nombreUnico: validarNombreUnico
              },
              onChange: (e) => {
                const value = e.target.value;
                if (value.length === 1) {
                  setValue("nombreCategoria", value.toUpperCase(), { shouldValidate: true });
                }
              }
            })}
            placeholder="Ej: Bebidas, Snacks, etc."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
              errors.nombreCategoria 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:border-transparent"
            }`}
            disabled={loading}
            autoComplete="off"
          />
          
          {errors.nombreCategoria && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.nombreCategoria.message}
            </div>
          )}

          {nombreActual && nombreActual.length >= 2 && !errors.nombreCategoria && (
            <div className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nombre válido
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Requisitos:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Mínimo 3 caracteres</li>
              <li>• Máximo 50 caracteres</li>
              <li>• No puede ser igual a una categoría existente</li>
              {categoriaEditar && (
                <li>• Debe ser diferente al nombre actual</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCerrar}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            disabled={loading || Object.keys(errors).length > 0}
          >
            <FiSave className="w-4 h-4" />
            {loading ? "Guardando..." : (categoriaEditar ? "Actualizar" : "Crear")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCategoria;