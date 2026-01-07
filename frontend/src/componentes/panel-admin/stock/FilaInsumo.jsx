import { FiPackage, FiAlertTriangle, FiEdit, FiTrash2 } from "react-icons/fi";

export const FilaInsumo = ({ insumo, onEditarStock, onEliminarInsumo  }) => {
  const handleEliminarClick = () => {
    onEliminarInsumo(insumo); 
  };
  const getEstadoStock = (stock) => {
    const actual = parseFloat(stock) || 0;
    const stockMinimo = 5; 
    
    if (actual === 0) return { 
      texto: 'Stock Agotado', 
      color: 'red', 
      icono: <FiAlertTriangle size={14} /> 
    };
    
    if (actual <= stockMinimo * 0.3) return { 
      texto: 'Stock Crítico', 
      color: 'red', 
      icono: <FiAlertTriangle size={14} /> 
    };
    
    if (actual <= stockMinimo) return { 
      texto: 'Stock Bajo', 
      color: 'orange', 
      icono: <FiAlertTriangle size={14} /> 
    };
    
    if (actual <= stockMinimo * 1.5) return { 
      texto: 'Stock Normal', 
      color: 'blue', 
      icono: <FiPackage size={14} /> 
    };
    
    return { 
      texto: 'Stock Óptimo', 
      color: 'green', 
      icono: <FiPackage size={14} /> 
    };
  };

  const estado = getEstadoStock(insumo.stockInsumo);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className='p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'>
              <FiPackage size={16} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {insumo.nombreInsumo}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
          Insumo
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {insumo.stockInsumo}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {insumo.unidadMedida}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          estado.color === 'red' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : estado.color === 'orange'
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            : estado.color === 'blue'
            ? 'bg-orange-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {estado.icono}
          {estado.texto}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEditarStock(insumo)}
            className="p-1 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar insumo"
          >
            <FiEdit size={16} />
          </button>
          <button 
            onClick={handleEliminarClick}
            className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title="Eliminar insumo"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};