import { FiFilter, FiSearch } from "react-icons/fi";
import { Tabla } from "../../ui/tabla/Tabla";
import FilaCajasCerradas from "./FilaCajasCerradas";
import { Paginacion } from "../../ui/tabla/Paginacion";
import { usePaginacion } from "../../../hooks/usePaginacion";

const TablasCajasCerradas = ({
  cajasCerradas, 
  formatCurrency, 
  formatDate,
  formatHora,
  paginaActual, 
  totalPaginas, 
  onCambiarPagina,
  itemsPorPagina,
  onCambiarItemsPorPagina,
  onVerDetalle,
  loading,
  totalRegistros // Asegúrate de recibir esto desde el hook useHistorialCajas
}) => {
  const encabezados = ["Fecha", "Hora cierre", "Saldo Inicial", "Saldo Actual", "Saldo Final", "Estado", "Acciones"];

  // CORRECCIÓN: Usar totalRegistros en lugar de totalPaginas * itemsPorPagina
  const paginacion = usePaginacion({
    paginaActual,
    limite: itemsPorPagina,
    total: totalRegistros, 
    onPagina: onCambiarPagina,
    onLimite: onCambiarItemsPorPagina,
  });

  const registros = cajasCerradas.map((cajaCerrada) => (
    <FilaCajasCerradas
      key={cajaCerrada.id_caja}
      cajaCerrada={cajaCerrada}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      formatHora={formatHora} 
      onVerDetalle={onVerDetalle}
    />
  )); 

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiFilter className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resumen de Cajas Cerradas
            </h2>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resumen de Cajas Cerradas
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({totalRegistros} registro{totalRegistros !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {cajasCerradas.length > 0 ? (
        <>
          <Tabla 
            encabezados={encabezados} 
            registros={registros} 
          />
          
          {totalPaginas >= 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Paginacion {...paginacion} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron registros
          </p>
        </div>
      )}
    </div>
  );
};

export default TablasCajasCerradas;