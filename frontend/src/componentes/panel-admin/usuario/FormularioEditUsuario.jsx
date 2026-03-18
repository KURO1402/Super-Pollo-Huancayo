import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const FormularioEditUsuario = ({ usuario, onSubmit, cerrar }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm();

  const mapearUsuarioAFormulario = (usuarioData) => {
    if (!usuarioData) return {};

    return {
      nombre: usuarioData.nombre_usuario || '',
      apellido: usuarioData.apellido_usuario || '',
      telefono: usuarioData.telefono_usuario || '',
      idUsuario: usuarioData.id_usuario,
      idRol: usuarioData.idRol
    };
  };

  useEffect(() => {
    if (usuario) {
      const datosFormulario = mapearUsuarioAFormulario(usuario);
      reset(datosFormulario);
    }
  }, [reset]);

  const manejarEnvio = (datosFormulario) => {
    onSubmit({
      nombresUsuario: datosFormulario.nombre,
      apellidosUsuario: datosFormulario.apellido,
      telefonoUsuario: datosFormulario.telefono || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvio)} className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              {...register("nombre", { required: "El nombre es requerido" })}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Apellido *
            </label>
            <input
              type="text"
              {...register("apellido", { required: "El apellido es requerido" })}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ingresa tu apellido"
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              {...register("telefono")}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ingresa tu teléfono"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={cerrar}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isDirty}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

export default FormularioEditUsuario;