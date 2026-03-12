import { FiPackage, FiAlertTriangle, FiEdit, FiTrash2 } from "react-icons/fi";

export const FilaInsumo = ({ insumo, onEditarStock, onEliminarInsumo }) => {

  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));

  // Fracción como texto simple: "1/2", "3/4", etc.
  const formatearCantidad = (valor) => {
    const num = parseFloat(valor) || 0;
    const entero = Math.floor(num);
    const decimal = Math.round((num - entero) * 100);
    if (decimal === 0) return <span>{entero}</span>;
    const divisor = mcd(decimal, 100);
    const numerador = decimal / divisor;
    const denominador = 100 / divisor;
    const fraccion = `${numerador}/${denominador}`;
    return (
      <span>
        {entero > 0 ? `${entero} ${fraccion}` : fraccion}
      </span>
    );
  };

  // Capitalizar: primera letra mayúscula, resto minúscula
  const capitalizar = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const pluralizarUnidad = (unidad, cantidad) => {
    if (!unidad) return '';
    const num = parseFloat(cantidad) || 0;
    if (num === 1) {
      const singulares = {
        'kilogramos': 'Kilogramo', 'gramos': 'Gramo', 'litros': 'Litro',
        'mililitros': 'Mililitro', 'unidades': 'Unidad', 'paquetes': 'Paquete', 'cajas': 'Caja',
        'kilogramo': 'Kilogramo', 'gramo': 'Gramo', 'litro': 'Litro',
        'mililitro': 'Mililitro', 'unidad': 'Unidad', 'paquete': 'Paquete', 'caja': 'Caja',
      };
      return singulares[unidad.toLowerCase()] || capitalizar(unidad);
    }
    const plurales = {
      'kilogramo': 'Kilogramos', 'gramo': 'Gramos', 'litro': 'Litros',
      'mililitro': 'Mililitros', 'unidad': 'Unidades', 'paquete': 'Paquetes', 'caja': 'Cajas',
      'kilogramos': 'Kilogramos', 'gramos': 'Gramos', 'litros': 'Litros',
      'mililitros': 'Mililitros', 'unidades': 'Unidades', 'paquetes': 'Paquetes', 'cajas': 'Cajas',
    };
    return plurales[unidad.toLowerCase()] || capitalizar(unidad);
  };

  const getEstadoStock = (stock) => {
    const actual = parseFloat(stock) || 0;
    const stockMinimo = 5;
    if (actual === 0) return { texto: 'Stock Agotado', color: 'red', icono: <FiAlertTriangle size={14} /> };
    if (actual <= stockMinimo * 0.3) return { texto: 'Stock Crítico', color: 'red', icono: <FiAlertTriangle size={14} /> };
    if (actual <= stockMinimo) return { texto: 'Stock Bajo', color: 'orange', icono: <FiAlertTriangle size={14} /> };
    if (actual <= stockMinimo * 1.5) return { texto: 'Stock Normal', color: 'blue', icono: <FiPackage size={14} /> };
    return { texto: 'Stock Óptimo', color: 'green', icono: <FiPackage size={14} /> };
  };

  const estado = getEstadoStock(insumo.stock_insumo);
  const unidadMostrada = pluralizarUnidad(insumo.unidad_medida, insumo.stock_insumo);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
            <FiPackage size={16} />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {insumo.nombre_insumo}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {formatearCantidad(insumo.stock_insumo)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{unidadMostrada}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          estado.color === 'red'    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          : estado.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
          : estado.color === 'blue'   ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
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
            className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors cursor-pointer"
            title="Editar insumo"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => onEliminarInsumo(insumo)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
            title="Eliminar insumo"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};