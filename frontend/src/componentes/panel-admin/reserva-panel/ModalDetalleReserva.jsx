import { useEffect } from "react";
import { FiLoader, FiUsers, FiClock, FiCalendar, FiTag } from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";

const ModalDetalleReserva = ({ reserva }) => {
  const { reservacionDetalle, cargandoDetalle, cargarReservacionPorId, limpiarDetalle } =
    useReservacionAdminStore();

  useEffect(() => {
    cargarReservacionPorId(reserva.id_reservacion);
    return () => limpiarDetalle();
  }, [reserva.id_reservacion]);

  const detalle = reservacionDetalle;

  const getEstadoColor = (estado) => {
    const colores = {
      confirmada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return colores[estado?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="p-2 space-y-4">
      {cargandoDetalle ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FiLoader className="animate-spin w-10 h-10 text-blue-500" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando detalles...</p>
        </div>
      ) : detalle ? (
        <>
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-400" />
              <span className="text-lx font-mono text-gray-600 dark:text-gray-300">
                {detalle.codigo_reservacion}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(detalle.estado_reservacion)}`}>
              {detalle.estado_reservacion}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icono={<FiUsers className="text-blue-500 text-xl" />}
              titulo="Cliente"
              contenido={detalle.nombre_completo}
            />
            <InfoCard
              icono={<FiCalendar className="text-green-500 text-xl" />}
              titulo="Fecha"
              contenido={detalle.fecha_reservacion}
            />
            <InfoCard
              icono={<FiClock className="text-purple-500 text-xl" />}
              titulo="Hora"
              contenido={detalle.hora_reservacion}
            />
            <InfoCard
              icono={<FiUsers className="text-orange-500 text-xl" />}
              titulo="Cantidad de personas"
              contenido={
                <span className="font-semibold">
                  {detalle.cantidad_personas} {detalle.cantidad_personas === 1 ? "persona" : "personas"}
                </span>
              }
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MdOutlineTableRestaurant className="text-gray-500 text-xl" />
              Mesas asignadas
            </h3>
            
            {detalle.mesas?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detalle.mesas.map((mesa, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border dark:text-gray-100 border-gray-200 dark:border-gray-600 text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Mesa {mesa.numero_mesa}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No hay mesas asignadas
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">📋</div>
          <p className="text-gray-500 dark:text-gray-400">
            No se pudo cargar el detalle de la reserva
          </p>
        </div>
      )}
    </div>
  );
};

// Componente InfoCard para mostrar información en formato tarjeta
const InfoCard = ({ icono, titulo, contenido }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 transition-all hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="text-2xl">{icono}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{titulo}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {contenido}
        </p>
      </div>
    </div>
  </div>
);

export default ModalDetalleReserva;