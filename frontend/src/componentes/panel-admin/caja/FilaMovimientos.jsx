import { FiTrendingDown, FiTrendingUp, FiUser } from "react-icons/fi";

const FilaMovimientos = ({ movimiento, formatCurrency }) => {
  const esIngreso = movimiento.tipo_movimiento === "ingreso";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            esIngreso
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {esIngreso ? (
            <FiTrendingUp className="w-3 h-3" />
          ) : (
            <FiTrendingDown className="w-3 h-3" />
          )}
          {esIngreso ? "Ingreso" : "Egreso"}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {movimiento.descripcion_mov_caja}
      </td>
      <td
        className={`px-6 py-4 text-sm font-medium ${
          esIngreso
            ? "text-green-700 dark:text-green-400"
            : "text-red-700 dark:text-red-400"
        }`}
      >
        {esIngreso ? "+" : "-"}
        {formatCurrency(Number(movimiento.monto_movimiento))}
      </td>

      {/* FECHA */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-900 dark:text-white">
            {movimiento.fecha}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {movimiento.hora}
          </span>
        </div>
      </td>

      {/* USUARIO */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {movimiento.nombre_usuario}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default FilaMovimientos;