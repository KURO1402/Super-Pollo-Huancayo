import { FiEye, FiEdit, FiUser, FiCalendar, FiClock, FiUsers } from "react-icons/fi";

export const FilaReserva = ({ reserva, onVerDetalle, onEditar }) => {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagado': 
        return { 
          bg: 'bg-green-100 dark:bg-green-900/30', 
          text: 'text-green-800 dark:text-green-400'
        };
      case 'pendiente': 
        return { 
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          text: 'text-amber-800 dark:text-amber-400',
        };
      case 'cancelado': 
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-800 dark:text-red-400',
        };
      default: 
        return { 
          bg: 'bg-gray-100 dark:bg-gray-700', 
          text: 'text-gray-800 dark:text-gray-300',
        };
    }
  };

  const estado = getEstadoColor(reserva.estadoReservacion);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <FiCalendar size={16} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              #{reserva.idReservacion}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatearFecha(reserva.fechaReservacion)}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <FiUser size={16} />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {reserva.nombresUsuario}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <FiUsers size={14} />
            <span>{reserva.cantidadPersonas} pers.</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mesa {reserva.numeroMesa}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <FiClock size={14} />
            <span>{reserva.horaReservacion.substring(0,5)}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${estado.bg} ${estado.text}`}>
          {reserva.estadoReservacion.charAt(0).toUpperCase() + reserva.estadoReservacion.slice(1)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onVerDetalle(reserva)}
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            title="Ver detalles"
          >
            <FiEye size={16} />
          </button>
          <button 
            onClick={() => onEditar(reserva)}
            className="p-1 text-amber-500 hover:text-amber-700 transition-colors cursor-pointer"
            title="Editar reserva"
          >
            <FiEdit size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};