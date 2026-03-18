import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { obtenerRolesUsuariosServicio } from '../../../servicios/usuariosServicios';
import { FiSearch, FiX } from 'react-icons/fi';

const FiltrosUsuarios = ({ filtros, onCambio, onLimpiar }) => {
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda ?? '');
  const busquedaDebounced = useDebounce(busquedaLocal, 500);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const data = await obtenerRolesUsuariosServicio();
        setRoles(data.roles ?? []);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };
    cargarRoles();
  }, []);

  useEffect(() => {
    if (busquedaDebounced !== filtros.busqueda) {
      onCambio({ busqueda: busquedaDebounced });
    }
  }, [busquedaDebounced]);

  useEffect(() => {
    setBusquedaLocal(filtros.busqueda ?? '');
  }, [filtros.busqueda]);

  const hayFiltros = busquedaLocal !== '' || filtros.rol !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 mb-5">

      <select
        value={filtros.rol ?? ''}
        onChange={(e) => onCambio({ rol: e.target.value })}
        className="sm:w-48 px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="">Todos los roles</option>
        {roles.map((role) => (
          <option key={role.id_rol} value={role.id_rol}>
            {role.nombre_rol.charAt(0).toUpperCase() + role.nombre_rol.slice(1)}
          </option>
        ))}
      </select>

      {hayFiltros && (
        <button
          onClick={() => {
            setBusquedaLocal('');
            onLimpiar();
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <FiX size={14} />
          Limpiar
        </button>
      )}
    </div>
  );
};

export default FiltrosUsuarios;