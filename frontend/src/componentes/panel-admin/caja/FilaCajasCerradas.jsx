import { FiEye } from "react-icons/fi";

const FilaCajasCerradas = ({ 
  cajaCerrada, 
  onVerDetalle 
}) => {
  
  const handleVerDetalle = () => {
    onVerDetalle(cajaCerrada.id_caja);
  };

  const getEstadoInfo = () => {
    if (cajaCerrada.estado_caja === "cerrada") {
      return {
        texto: "Cerrada",
        clases: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      };
    } else if (cajaCerrada.estado_caja === "abierta") {
      return {
        texto: "Abierta",
        clases: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      };
    } else {
      return {
        texto: cajaCerrada.estado_caja || "Desconocido",
        clases: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      };
    }
  };

  const estadoInfo = getEstadoInfo();

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {cajaCerrada.fecha_apertura}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {cajaCerrada.hora_apertura}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {cajaCerrada.saldo_inicial}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {cajaCerrada.monto_actual}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {cajaCerrada.saldo_final}
      </td>
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoInfo.clases}`}
        >
          {estadoInfo.texto}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleVerDetalle}
          className="flex items-center cursor-pointer gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          title="Ver detalle de la caja"
        >
          <FiEye className="w-4 h-4" />
          Ver Detalle
        </button>
      </td>
    </tr>
  );
};

export default FilaCajasCerradas;