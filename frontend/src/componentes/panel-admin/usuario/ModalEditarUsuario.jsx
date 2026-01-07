import { FiSave, FiX, FiLoader, FiShield } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { actualizarRolUsuarioServicio, listarRolesServicio, obtenerUsuarioPorIdServicio } from "../../../servicios/usuariosServicios";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

export const ModalEditarUsuario = ({ idUsuario, onClose, onUsuarioActualizado }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [cargandoRoles, setCargandoRoles] = useState(false);

  useEffect(() => {
    if (idUsuario) {
      cargarUsuario();
      cargarRoles();
    }
  }, [idUsuario]);

  const cargarUsuario = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerUsuarioPorIdServicio(idUsuario);
      
      if (respuesta.ok && respuesta.usuario) {
        const usuarioData = respuesta.usuario;
        setUsuario(usuarioData);
        
        reset({
          nuevoRol: usuarioData.idRol?.toString() || ''
        });
      }
    } catch (error) {
      mostrarAlerta.error("Error al cargar los datos del usuario");
      onClose();
    } finally {
      setCargando(false);
    }
  };

  const cargarRoles = async () => {
    try {
      setCargandoRoles(true);
      const respuesta = await listarRolesServicio();
      
      if (respuesta.ok && respuesta.roles) {
        setRoles(respuesta.roles);
      } else {
        mostrarAlerta.error(respuesta.mensaje || "No se pudieron cargar los roles");
        setRoles([]);
      }
    } catch (error) {
      mostrarAlerta.error("Error al cargar los roles");
      setRoles([]);
    } finally {
      setCargandoRoles(false);
    }
  };

  const onSubmitUsuario = async (data) => {
    try {
      setGuardando(true);
      
      const idRolNuevo = parseInt(data.nuevoRol);

      if (usuario && usuario.idRol === idRolNuevo) {
        mostrarAlerta.advertencia("El usuario ya tiene asignado este rol");
        return;
      }

      const respuesta = await actualizarRolUsuarioServicio(idUsuario, idRolNuevo);
      
      if (respuesta.ok) {
        mostrarAlerta.exito(respuesta.mensaje || "Rol de usuario actualizado exitosamente");
        
        if (onUsuarioActualizado) {
          onUsuarioActualizado({
            ...usuario,
            idRol: idRolNuevo,
            rol: roles.find(rol => rol.idRol === idRolNuevo)
          });
        }
        
        onClose();
      } else {
        throw new Error(respuesta.mensaje || "Error al actualizar el rol del usuario");
      }
      
    } catch (error) {
      
      if (error.message.includes("Usted mismo no puede modificar su rol")) {
        mostrarAlerta.error("No puedes modificar tu propio rol");
      } else if (error.message.includes("El usuario especificado no existe")) {
        mostrarAlerta.error("El usuario no existe");
      } else if (error.message.includes("El rol especificado no existe")) {
        mostrarAlerta.error("El rol seleccionado no existe");
      } else {
        mostrarAlerta.error(error.message || "Error al actualizar el rol del usuario");
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitUsuario)} className="p-6">

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <div className="flex items-center gap-2">
            <FiShield className="text-purple-600 dark:text-purple-400" size={16} />
            Cambiar Rol del Usuario *
          </div>
        </label>
        
        {cargandoRoles ? (
          <div className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 flex items-center">
            <FiLoader className="animate-spin mr-2 text-gray-500" size={16} />
            <span className="text-sm text-gray-500">Cargando roles...</span>
          </div>
        ) : (
          <>
            <select
              {...register("nuevoRol", { required: "Debe seleccionar un rol" })} // Cambiado a nuevoRol
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              disabled={guardando || cargandoRoles}
            >
              <option value="">Selecciona un rol</option>
              {roles && roles.length > 0 ? (
                roles.map((rol) => (
                  <option key={rol.idRol} value={rol.idRol}>
                    {rol.nombreRol}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay roles disponibles</option>
              )}
            </select>
            
            {errors.nuevoRol && (
              <p className="mt-1 text-sm text-red-600">{errors.nuevoRol.message}</p>
            )}
          </>
        )}
        
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Selecciona el nuevo rol que tendrá este usuario en el sistema
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
          Importante
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Al cambiar el rol del usuario, se modificarán sus permisos y acceso a las funciones del sistema.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          disabled={guardando}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando || cargandoRoles}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardando ? (
            <>
              <FiLoader className="animate-spin" size={16} />
              Actualizando...
            </>
          ) : (
            <>
              <FiSave size={16} />
              Actualizar Rol
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ModalEditarUsuario;