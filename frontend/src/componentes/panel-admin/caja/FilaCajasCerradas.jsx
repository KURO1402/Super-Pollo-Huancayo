import { FiAlertTriangle, FiCheckCircle, FiEye, FiXCircle } from "react-icons/fi";

const FilaCajasCerradas = ({ 
  cajaCerrada, 
  formatCurrency,
  onVerDetalle 
}) => {
  
  const handleVerDetalle = () => {
    onVerDetalle(cajaCerrada.idCaja);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {cajaCerrada.fecha}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {cajaCerrada.nombreUsuario}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {formatCurrency(cajaCerrada.montoActual)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {formatCurrency(cajaCerrada.montoTotal)}
      </td>
      <td
        className={`px-6 py-4 text-sm font-medium ${
          cajaCerrada.diferencia > 0
            ? "text-green-700 dark:text-green-400"
            : cajaCerrada.diferencia < 0
            ? "text-red-700 dark:text-red-400"
            : "text-gray-700 dark:text-gray-400"
        }`}
      >
        {cajaCerrada.diferencia > 0
          ? `+${formatCurrency(cajaCerrada.diferencia)}`
          : cajaCerrada.diferencia < 0
          ? `${formatCurrency(cajaCerrada.diferencia)}`
          : formatCurrency(cajaCerrada.diferencia)}
      </td>
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            cajaCerrada.estadoCaja === "cuadra"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : cajaCerrada.estadoCaja === "sobra"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {cajaCerrada.estadoCaja === "cuadra" ? (
            <FiCheckCircle className="w-3 h-3" />
          ) : cajaCerrada.estadoCaja === "sobra" ? (
            <FiAlertTriangle className="w-3 h-3" />
          ) : (
            <FiXCircle className="w-3 h-3" />
          )}
          {cajaCerrada.estadoCaja === "cuadra"
            ? "Cuadrada"
            : cajaCerrada.estadoCaja === "sobra"
            ? "Sobrante"
            : "Faltante"}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleVerDetalle}
          className="flex items-center cursor-pointer gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          <FiEye className="w-4 h-4" />
          Ver Detalle
        </button>
      </td>
    </tr>
  );
};

export default FilaCajasCerradas;