import { FiEye, FiClock } from "react-icons/fi";
import { formatMoneda, calcularDiferencia } from "../../../utilidades/formatCurrencyCaja";
import { obtenerIniciales } from "../../../utilidades/obtenerInicialesCaja";

const Avatar = ({ nombre }) => (
  <div
    className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-semibold shrink-0"
    title={nombre || "Desconocido"}
  >
    {obtenerIniciales(nombre)}
  </div>
);

const FilaCajasCerradas = ({ cajaCerrada, onVerDetalle }) => {
  const handleVerDetalle = () => onVerDetalle(cajaCerrada.id_caja);

  const diferencia = calcularDiferencia(
    cajaCerrada.saldo_inicial,
    cajaCerrada.saldo_final
  );

  const colorDiferencia =
    diferencia === null
      ? "text-gray-400"
      : diferencia > 0
      ? "text-green-600 dark:text-green-400"
      : diferencia < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
        #{cajaCerrada.id_caja}
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <div className="flex items-center gap-2">
          <Avatar nombre={cajaCerrada.usuario_apertura} />
          <span className="font-medium">{cajaCerrada.fecha_apertura || "---"}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <div className="flex items-center gap-2">
          <Avatar nombre={cajaCerrada.usuario_cierre} />
          <span className="font-medium">{cajaCerrada.fecha_cierre || "---"}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium tabular-nums">
        {formatMoneda(cajaCerrada.saldo_inicial)}
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium tabular-nums">
        {formatMoneda(cajaCerrada.saldo_final)}
      </td>

      <td className={`px-6 py-4 text-sm font-semibold tabular-nums ${colorDiferencia}`}>
        {diferencia === null
          ? "---"
          : `${diferencia > 0 ? "+" : ""}${formatMoneda(diferencia)}`}
      </td>

      <td className="px-6 py-4">
        <button
          onClick={handleVerDetalle}
          aria-label={`Ver detalle de la caja #${cajaCerrada.id_caja}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 cursor-pointer"
        >
          <FiEye className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ver Detalle</span>
        </button>
      </td>
    </tr>
  );
};

export default FilaCajasCerradas;