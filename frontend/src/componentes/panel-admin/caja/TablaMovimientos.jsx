import { FiClock } from "react-icons/fi";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaCashRegister } from "react-icons/fa";
import { Tabla } from "../../ui/tabla/Tabla";
import { Paginacion } from "../../ui/tabla/Paginacion";
import FilaMovimientos from "./FilaMovimientos";
import { useCajaStore } from "../../../store/useCajaStore";

const TablaMovimientos = ({ movimientos, formatCurrency, paginaActual, totalPaginas, onCambiarPagina }) => {
  const {caja} = useCajaStore();
  const encabezados = ["Tipo", "Descripción", "Monto", "Fecha", "Usuario"];

  const registros = movimientos.map((movimiento) => (
    <FilaMovimientos 
      key={movimiento.id}
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
            Movimientos Recientes
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({movimientos.length} movimientos)
          </span>
        </div>
      </div>
      
      {movimientos.length > 0 ? (
        <>
          <Tabla
            encabezados={encabezados}
            registros={registros}
          />
          
          {totalPaginas > 1 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              alCambiarPagina={onCambiarPagina}
            />
          )}
        </>
      ) : caja.estado === "cerrada" ? (
        <div className="text-center py-12">
          <FaCashRegister className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">¡Abre una nueva caja para comenzar!</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <FaArrowRightArrowLeft className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Registra un movimiento para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default TablaMovimientos;