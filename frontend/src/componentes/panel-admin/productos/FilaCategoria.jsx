import { FiEdit2 } from "react-icons/fi";

const FilaCategoria = ({ 
  categoria, 
  onEditar
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
        {categoria.nombreCategoria}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditar(categoria)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FilaCategoria;