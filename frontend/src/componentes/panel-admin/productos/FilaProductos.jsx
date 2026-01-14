import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export const FilaProducto = ({ producto, onGestionarInsumos, onEditarProducto, onEliminarProducto }) => {
  const getUsaInsumosClases = (usaInsumos) => {
    if (usaInsumos === 1) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const getConfiguracionInsumos = (usaInsumos) => {
    if (usaInsumos === 1) {
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

  const configInsumos = getConfiguracionInsumos(producto.usaInsumos);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={producto.urlImagen}
              alt={producto.nombreProducto}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40?text=IMG';
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {producto.nombreProducto}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {producto.descripcionProducto || 'Sin descripción'}
            </div>
          </div>
        </div>
      </td>
      
      {/* PRECIO */}
      <td className="px-4 py-3">
        <span className="font-semibold text-green-600 dark:text-green-400">
          S/{parseFloat(producto.precio).toFixed(2)}
        </span>
      </td>

      {/* CATEGORIA */}
      <td className="px-4 py-3">
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          {producto.nombreCategoria}
        </span>
      </td>
      
      {/* USA INSUMOS */}
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUsaInsumosClases(producto.usaInsumos)}`}>
          {producto.usaInsumos === 1 ? 'Con insumos' : 'Sin insumos'}
        </span>
      </td>
      
      {/* GESTIÓN DE INSUMOS */}
      <td className="px-4 py-3">
        <button
          onClick={() => onGestionarInsumos(producto)}
          className={`p-1.5 transition-colors cursor-pointer flex items-center font-medium ${configInsumos.clases}`}
          title={producto.usaInsumos === 1 ? "Modificar insumos existentes" : "Agregar sistema de insumos"}
        >
          {configInsumos.icono}
          <span className="text-sm">
            {configInsumos.texto}
          </span>
        </button>
      </td>
      
      {/* ACCIONES */}
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button 
            onClick={() => onEditarProducto(producto)}
            className="p-1.5 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar producto"
          >
            <FiEdit size={16}/>
          </button>
          <button 
            onClick={() => onEliminarProducto(producto)}
            className="p-1.5 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title="Eliminar producto"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};