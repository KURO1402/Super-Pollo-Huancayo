import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

import { ROLES } from '../../../constantes/roles';
import { FiSearch } from 'react-icons/fi';

const FiltrosUsuarios = ({ filtros, onCambio, onLimpiar }) => {
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda ?? '');
  const busquedaDebounced = useDebounce(busquedaLocal, 500);

  useEffect(() => {
    if (busquedaDebounced !== filtros.busqueda) {
      onCambio({ busqueda: busquedaDebounced });
    }
  }, [busquedaDebounced]);

  useEffect(() => {
    setBusquedaLocal(filtros.busqueda ?? '');
  }, [filtros.busqueda]);

  const hayFiltros = busquedaLocal !== '' || filtros.id_rol !== '';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            <FiSearch/>
          </span>
          <input
            type="text"
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            placeholder="Buscar por nombre, correo…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:text-white"
          />
        </div>

        <select
          value={filtros.id_rol ?? ''}
          onChange={(e) => onCambio({ id_rol: e.target.value })}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:text-white"
        >
          <option value="">Todos los roles</option>
          {Object.entries(ROLES).map(([key, valor]) => (
            <option key={valor} value={valor}>
              {/* Capitalizar primera letra */}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>

        {/* Limpiar */}
        {hayFiltros && (
          <button
            onClick={() => {
              setBusquedaLocal('');
              onLimpiar();
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors whitespace-nowrap"
          >
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltrosUsuarios;