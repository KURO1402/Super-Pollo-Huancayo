import { FiArrowDown, FiUser } from "react-icons/fi";

export const FilaEntrada = ({ entrada  }) => {

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <FiArrowDown className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {entrada.nombreInsumo}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            +{entrada.cantidadMovimiento}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {entrada.fechaMovimiento}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {entrada.horaMovimiento}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
          <FiUser size={14} className="text-gray-400" />
          {entrada.nombreUsuario}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {entrada.detallesMovimiento == "-" ? "No hay detalle": entrada.detallesMovimiento}
        </div>
      </td>
    </tr>
  );
};