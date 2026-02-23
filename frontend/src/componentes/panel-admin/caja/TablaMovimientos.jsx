import { FiClock } from "react-icons/fi";
import { FaArrowRightArrowLeft, FaCashRegister } from "react-icons/fa6";
import { Tabla } from "../../ui/tabla/Tabla";
import { Paginacion } from "../../ui/tabla/Paginacion";
import FilaMovimientos from "./FilaMovimientos";
import { usePaginacion } from "../../../hooks/usePaginacion";

const TablaMovimientos = ({
  movimientos = [],
  totalMovimientos = 0,
  cargando = false,
  formatCurrency,
  paginaActual = 1,
  limite = 10,
  onCambiarPagina,
  onCambiarLimite,
  cajaEstado
}) => {
  const paginacion = usePaginacion({
      paginaActual,
      limite,
      total: totalMovimientos,
      onPagina: onCambiarPagina,
      onLimite: onCambiarLimite,
    });

  const encabezados = ["Tipo", "Descripción", "Monto", "Fecha", "Usuario"];

  const totalPaginas = Math.ceil(totalMovimientos / limite);

  const registros = movimientos.map((movimiento) => (
    <FilaMovimientos
      key={movimiento.id_movimiento_caja}
      movimiento={movimiento}
      formatCurrency={formatCurrency}
    />
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiClock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Movimientos
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({totalMovimientos} movimiento{totalMovimientos !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : movimientos.length > 0 ? (
        <>
          <Tabla encabezados={encabezados} registros={registros} />
          {totalPaginas >= 1 && (
            <div className="mt-4">
              <Paginacion {...paginacion} />
            </div>
          )}
        </>
      ) : cajaEstado === "cerrada" ? (
        <div className="text-center py-12">
          <FaCashRegister className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            ¡Abre una nueva caja para comenzar!
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <FaArrowRightArrowLeft className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Registra un movimiento para comenzar
          </p>
        </div>
      )}
    </div>
  );
};

export default TablaMovimientos;