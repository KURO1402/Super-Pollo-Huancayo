import { FiSave, FiLoader } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { obtenerRolesUsuariosServicio } from "../../../servicios/usuariosServicios";
import { useUsuariosStore } from "../../../store/useUsuarioStore";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const ModalEditarUsuario = ({ usuario, onClose }) => {
  const { actualizarRol } = useUsuariosStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    cargarRoles();
    reset({ nuevoRol: usuario.id_rol?.toString() || "" });
  }, [usuario, reset]);

  const cargarRoles = async () => {
    try {
      const r = await obtenerRolesUsuariosServicio();
      setRoles(r.roles || []);
    } catch {
      mostrarAlerta.error("No se pudieron cargar los roles");
      onClose();
    } finally {
      setCargando(false);
    }
  };

  const onSubmit = async ({ nuevoRol }) => {
    const idRol = Number(nuevoRol);

    if (!idRol) {
      mostrarAlerta.error("Rol inválido");
      return;
    }

    if (usuario.id_rol === idRol) {
      mostrarAlerta.advertencia("El rol seleccionado ya está asignado");
      return;
    }

    try {
      await actualizarRol(usuario.id_usuario, idRol);
      mostrarAlerta.exito("Rol actualizado correctamente");
      onClose();
    } catch {
      mostrarAlerta.error("No se pudo actualizar el rol");
    }
  };

  if (cargando) {
    return (
      <div className="p-8 text-center">
        <FiLoader className="animate-spin mx-auto mb-3 text-purple-600" size={22} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cargando roles...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Cambiar rol de usuario
      </h3>

      <select
        {...register("nuevoRol", { required: true })}
        className="
          w-full h-11 rounded-lg border
          border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          px-4 text-sm
          text-gray-900 dark:text-white
          focus:outline-none
          focus:ring-2 focus:ring-purple-500
          transition-colors
        "
      >
        <option value="">Selecciona un rol</option>
        {roles.map((r) => (
          <option key={r.id_rol} value={r.id_rol}>
            {r.nombre_rol}
          </option>
        ))}
      </select>

      {errors.nuevoRol && (
        <p className="mt-2 text-sm text-red-500">
          Selecciona un rol
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="
            px-4 py-2 rounded-lg border
            border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="
            px-4 py-2 rounded-lg
            bg-purple-600 text-white
            hover:bg-purple-700
            transition-colors
          "
        >
          <FiSave className="inline mr-1" />
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ModalEditarUsuario;
