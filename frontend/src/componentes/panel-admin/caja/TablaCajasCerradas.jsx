import { FiFilter, FiSearch, FiInbox } from "react-icons/fi";
import { Tabla } from "../../ui/tabla/Tabla";
import FilaCajasCerradas from "./FilaCajasCerradas";
import { Paginacion } from "../../ui/tabla/Paginacion";
import { usePaginacion } from "../../../hooks/usePaginacion";

const encabezados = [
  "Caja",
  "Apertura",
  "Cierre",
  "Saldo Inicial",
  "Saldo Final",
  "Diferencia",
  "Acciones",
];

const FilaSkeleton = () => (
  <tr>
    {encabezados.map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const TablasCajasCerradas = ({
  cajasCerradas,
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  itemsPorPagina,
  onCambiarItemsPorPagina,
  onVerDetalle,
  loading,
  totalRegistros,
}) => {
  const paginacion = usePaginacion({
    paginaActual,
    limite: itemsPorPagina,
    total: totalRegistros,
    onPagina: onCambiarPagina,
    onLimite: onCambiarItemsPorPagina,
  });

  const registros = loading
    ? Array.from({ length: itemsPorPagina || 5 }).map((_, i) => (
        <FilaSkeleton key={`skeleton-${i}`} />
      ))
    : cajasCerradas.map((cajaCerrada) => (
        <FilaCajasCerradas
          key={cajaCerrada.id_caja}
          cajaCerrada={cajaCerrada}
          onVerDetalle={onVerDetalle}
        />
      ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <FiFilter className="w-5 h-5 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resumen de Cajas Cerradas
        </h2>
        {!loading && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({totalRegistros} registro{totalRegistros !== 1 ? "s" : ""})
          </span>
        )}
      </div>

      {loading || cajasCerradas.length > 0 ? (
        <>
          <Tabla encabezados={encabezados} registros={registros} />

          {!loading && totalPaginas >= 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Paginacion {...paginacion} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FiInbox className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No se encontraron registros
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default TablasCajasCerradas;