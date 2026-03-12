import { useState } from "react";
import { FiSearch, FiLoader } from "react-icons/fi";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const BuscadorReservacion = ({ onEncontrada }) => {
  const { cargandoBusqueda, buscarReservacionPorCodigo } = useReservacionAdminStore();
  const [codigo, setCodigo] = useState('');

  const manejarBuscar = async () => {
    const codigoLimpio = codigo.trim().toUpperCase();
    if (!codigoLimpio) {
      mostrarAlerta.advertencia('Ingresa un código de reservación');
      return;
    }
    try {
      await buscarReservacionPorCodigo(codigoLimpio);
      onEncontrada();
    } catch (error) {
      mostrarAlerta.error('No se encontró la reservación');
    }
  };

  const manejarKeyDown = (e) => {
    if (e.key === 'Enter') manejarBuscar();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
        onKeyDown={manejarKeyDown}
        placeholder="Ej: C8XM54"
        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={manejarBuscar}
        disabled={cargandoBusqueda}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm flex items-center gap-2"
      >
        {cargandoBusqueda
          ? <FiLoader className="animate-spin w-4 h-4" />
          : <FiSearch className="w-4 h-4" />
        }
        Buscar
      </button>
    </div>
  );
};

export default BuscadorReservacion;