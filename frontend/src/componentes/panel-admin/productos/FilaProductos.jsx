import { FiEdit, FiPlus } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { MdOutlineNoFood } from "react-icons/md";

export const FilaProducto = ({ producto, onGestionarInsumos, onEditarProducto, onDeshabilitarProducto }) => {
  const getUsaInsumosClases = (usaInsumos) => {
    if (usaInsumos === 1 || usaInsumos === 'Sí') {
      return "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getConfiguracionInsumos = (usaInsumos) => {
    if (usaInsumos === 1 || usaInsumos === 'Sí') {
      return {
        texto: "Gestionar insumos",
        icono: <LuChefHat size={17} className="mr-2" />,
        clases: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      };
    }
    return {
      texto: "Agregar insumos",
      icono: <FiPlus size={17} className="mr-2" />,
      clases: "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
    };
  };

  const configInsumos = getConfiguracionInsumos(producto.usa_insumos);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-900 dark:text-white">
          {producto.nombre_producto}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
          {producto.descripcion_producto || 'Sin descripción'}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="font-semibold text-green-600 dark:text-green-400">
          S/{parseFloat(producto.precio_producto).toFixed(2)}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          {producto.nombre_categoria}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUsaInsumosClases(producto.usa_insumos)}`}>
          {producto.usa_insumos === 1 || producto.usa_insumos === 'Sí' ? 'Si' : 'No'}
        </span>
      </td>

      <td className="px-4 py-3">
        <button
          onClick={() => onGestionarInsumos(producto)}
          className={`p-1.5 transition-colors cursor-pointer flex items-center font-medium ${configInsumos.clases}`}
          title={producto.usa_insumos === 1 || producto.usa_insumos === 'Sí' ? "Modificar insumos existentes" : "Agregar sistema de insumos"}
        >
          {configInsumos.icono}
          <span className="text-sm">{configInsumos.texto}</span>
        </button>
      </td>

      <td className="px-4 py-3">
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => onEditarProducto(producto)}
            className="p-1.5 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar producto"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => onDeshabilitarProducto(producto)}
            className="p-1.5 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Deshabilitar producto"
          >
            <MdOutlineNoFood size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};