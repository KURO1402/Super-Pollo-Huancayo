import { FiEdit, FiPlus } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

export const FilaProducto = ({ producto, onGestionarInsumos, onEditarProducto, onToggleProducto }) => {
  const getUsaInsumosClases = (usaInsumos) => {
    if (usaInsumos === 1 || usaInsumos === 'Sí') {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const getConfiguracionInsumos = (usaInsumos) => {
    if (usaInsumos === 1 || usaInsumos === 'Sí') {
      return {
        texto: "Gestionar insumos",
        icono: <LuChefHat size={17} className="mr-2" />,
        clases: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      };
    } else {
      return {
        texto: "Agregar insumos",
        icono: <FiPlus size={17} className="mr-2" />,
        clases: "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
      };
    }
  };

  const getEstadoClases = () => {
    if (producto.estado === 1) {
      return "text-green-600 dark:text-green-400";
    }
    return "text-gray-400 dark:text-gray-600";
  };

  const configInsumos = getConfiguracionInsumos(producto.usa_insumos);

  return (
    <tr className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
      producto.estado === 0 ? 'bg-gray-200 dark:bg-gray-900 opacity-60' : ''
    }`}>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {producto.nombre_producto}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {producto.descripcion_producto || 'Sin descripción'}
            </div>
          </div>
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
          {producto.usa_insumos === 1 || producto.usa_insumos === 'Sí' ? 'Con insumos' : 'Sin insumos'}
        </span>
      </td>
      
      <td className="px-4 py-3">
        <button
          onClick={() => onGestionarInsumos(producto)}
          className={`p-1.5 transition-colors cursor-pointer flex items-center font-medium ${configInsumos.clases}`}
          title={producto.usa_insumos === 1 || producto.usa_insumos === 'Sí' ? "Modificar insumos existentes" : "Agregar sistema de insumos"}
        >
          {configInsumos.icono}
          <span className="text-sm">
            {configInsumos.texto}
          </span>
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2 items-center">
          <button 
            onClick={() => onEditarProducto(producto)}
            className="p-1.5 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar producto"
          >
            <FiEdit size={16}/>
          </button>
          {/* <button
            onClick={() => onToggleProducto(producto)}
            className={`p-1.5 transition-colors cursor-pointer flex items-center gap-1 ${getEstadoClases()}`}
            title={producto.estado === 1 ? 'Deshabilitar producto' : 'Habilitar producto'}
          >
            {producto.estado === 1 ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
            <span className="text-xs font-medium">
              {producto.estado === 1 ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </button> */}
        </div>
      </td>
    </tr>
  );
};