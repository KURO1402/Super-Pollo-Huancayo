import { FiUser, FiCalendar, FiClock, FiUsers, FiDollarSign, FiBox } from "react-icons/fi";

export const ModalDetalleReserva = ({ reserva, detalle }) => {
  if (!reserva) return null;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagado': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pendiente': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelado': 
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularTotal = () => {
    if (!detalle?.detalles) return 0;
    return detalle.detalles.reduce((total, item) => {
      const precio = Number(item.precioUnitario) || 0;
      const cantidad = Number(item.cantidadProductoReservacion) || 0;
      return total + (precio * cantidad);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reserva #{reserva.idReservacion}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Creada el {new Date(reserva.fechaCreacion).toLocaleDateString('es-ES')}
          </p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estadoReservacion)}`}>
          {reserva.estadoReservacion?.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <FiUser size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
            <p className="text-gray-900 dark:text-white font-medium">{reserva.nombresUsuario}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <FiCalendar size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {formatearFecha(reserva.fechaReservacion)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiClock size={12} />
              {reserva.horaReservacion?.substring(0,5)} horas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <FiUsers size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Personas</p>
            <p className="text-gray-900 dark:text-white font-medium">{reserva.cantidadPersonas} personas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <FiBox size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mesa</p>
            <p className="text-gray-900 dark:text-white font-medium">#{reserva.numeroMesa}</p>
          </div>
        </div>
      </div>

      {detalle?.detalles && detalle.detalles.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Productos Reservados
          </h4>
          <div className="space-y-2">
            {detalle.detalles.map((producto, index) => {
              const precio = Number(producto.precioUnitario) || 0;
              const cantidad = Number(producto.cantidadProductoReservacion) || 0;
              return (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Producto: {producto.nombreProducto}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cantidad} x S/ {precio.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    S/ {(precio * cantidad).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
            <FiDollarSign size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Estimado</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              S/ {calcularTotal().toFixed(2)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estadoReservacion)}`}>
          {reserva.estadoReservacion?.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
