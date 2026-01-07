import { FiEdit, FiTrash2, FiMail, FiPhone } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";

const FilaUsuario = ({ usuario, onEliminarUsuario, onEditarUsuario }) => {
  const handleEditar = () => {
    if (onEditarUsuario) {
      onEditarUsuario(usuario);
    }
  };

  const handleEliminar = () => {
    if (onEliminarUsuario) {
      onEliminarUsuario(usuario);
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {usuario.nombresUsuario} {usuario.apellidosUsuario}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FiMail className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">{usuario.correoUsuario}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{usuario.telefonoUsuario}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FaIdCard className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">{
              usuario.idTipoDocumento === 1 ? "DNI" : 
              usuario.idTipoDocumento === 2 ? "Pasaporte" : 
              usuario.idTipoDocumento === 3 ? "Carné de extranjería" : "RUC"
            }</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">N°{usuario.numeroDocumentoUsuario}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        { usuario.idRol === 1 ? 
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"> 
            SuperAdministrador
          </div> 
          : usuario.idRol === 2 ? 
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"> 
            Administrador
          </div> 
          : <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"> 
            Usuario 
          </div> 
        }
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditar}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            title="Editar usuario"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          { usuario.idRol === 1 ? "" :
          <button
            onClick={handleEliminar}
            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
            title="Eliminar usuario"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
          }
        </div>
      </td>
    </tr>
  );
};

export default FilaUsuario;