import { FiEdit, FiTrash2, FiRotateCcw, FiMail, FiPhone } from "react-icons/fi";
import { Tabla } from '../../ui/tabla/Tabla';

const TablaUsuarios = ({ usuarios, cargando, esSuperadmin, onEditarRol, onEliminarUsuario, onReactivarUsuario }) => {
  console.log(usuarios);
  return (
    <Tabla encabezados={['Usuario', 'Correo', 'Teléfono', 'Rol', 'Acciones']}
      registros={usuarios.map(u => (
        <FilaUsuario
          key={u.id_usuario}
          usuario={u}
          esSuperadmin={esSuperadmin}
          onEditarRol={onEditarRol}
          onEliminarUsuario={onEliminarUsuario}
          onReactivarUsuario={onReactivarUsuario}
        />
      ))} cargando={cargando} />
  );
};

const FilaUsuario = ({ usuario, esSuperadmin, onEditarRol, onEliminarUsuario, onReactivarUsuario }) => {
  const inactivo = usuario.estado_usuario === 0;
  const esObjetivoAdmin = usuario.id_rol === 3;
  const esObjetivoSuperadmin = usuario.es_superadmin === 1;

  // Nadie puede cambiar el rol, eliminar ni reactivar a un superadmin.
  const puedeEditarRol = !esObjetivoSuperadmin && (esSuperadmin || !esObjetivoAdmin);
  const puedeEliminarOReactivar = esSuperadmin && !esObjetivoSuperadmin;

  const handleEditar = () => {
    if (inactivo || !puedeEditarRol) return;
    if (onEditarRol) {
      onEditarRol(usuario);
    }
  };

  const handleEliminar = () => {
    if (inactivo || !puedeEliminarOReactivar) return;
    if (onEliminarUsuario) {
      onEliminarUsuario(usuario);
    }
  };

  const handleReactivar = () => {
    if (!inactivo || !puedeEliminarOReactivar) return;
    if (onReactivarUsuario) {
      onReactivarUsuario(usuario);
    }
  };

  return (
    <tr
      className={`transition-colors duration-150 ${inactivo
          ? "bg-gray-50 dark:bg-gray-800/40 opacity-50"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
    >
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {usuario.nombre_usuario} {usuario.apellido_usuario}
          </p>
          {inactivo && (
            <span className="text-xs text-gray-400 dark:text-gray-500">Inactivo</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FiMail className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">{usuario.correo_usuario}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FiPhone className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-white">{usuario.telefono_usuario}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {usuario.id_rol === 1 ?
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            Usuario
          </div>
          : usuario.id_rol === 2 ?
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              Colaborador
            </div>
            : <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Administrador
            </div>
        }
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {puedeEditarRol ? (
            <button
              onClick={handleEditar}
              disabled={inactivo}
              className={`p-1.5 transition-colors duration-200 ${inactivo
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                }`}
              title={inactivo ? "Usuario inactivo" : "Editar rol"}
            >
              <FiEdit className="w-4 h-4" />
            </button>
          ) : (
            <div
              className="p-1.5"
              title={
                esObjetivoSuperadmin
                  ? "No se puede editar el rol"
                  : "No puedes editar a otro administrador"
              }
            >
              <FiEdit className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            </div>
          )}

          {esSuperadmin && (
            esObjetivoSuperadmin ? (
              <div
                className="p-1.5"
                title={
                  inactivo
                    ? "No se puede reactivar al usuario"
                    : "No se puede eliminar al usuario"
                }
              >
                {inactivo ? (
                  <FiRotateCcw className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                ) : (
                  <FiTrash2 className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                )}
              </div>
            ) : inactivo ? (
              <button
                onClick={handleReactivar}
                className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                title="Reactivar usuario"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleEliminar}
                className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                title="Eliminar usuario"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  );
};

export default TablaUsuarios;