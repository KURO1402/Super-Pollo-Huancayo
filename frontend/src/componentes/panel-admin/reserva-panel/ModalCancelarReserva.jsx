import { useEffect } from "react";
import { FiAlertTriangle, FiX, FiLoader, FiUsers, FiClock, FiHash } from "react-icons/fi";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";

const ModalCancelarReserva = ({ reserva, onClose, onCancelada }) => {
  const { reservacionDetalle, cargandoDetalle, guardando, cargarReservacionPorId, limpiarDetalle } =
    useReservacionAdminStore();

  useEffect(() => {
    cargarReservacionPorId(reserva.id_reservacion);
    return () => limpiarDetalle();
  }, [reserva.id_reservacion]);

  const detalle = reservacionDetalle;
  const yaCancelada = detalle?.estado_reservacion === 'cancelado' || reserva.estado_reservacion === 'cancelado';

  return (
    <div className="p-4 space-y-4">
      {cargandoDetalle ? (
        <div className="flex items-center justify-center py-10">
          <FiLoader className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : detalle ? (
        <>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 text-sm">
            <Fila icono={<FiHash />}   label="Código"    valor={detalle.codigo_reservacion} />
            <Fila icono={<FiUsers />}  label="Cliente"   valor={detalle.nombre_completo} />
            <Fila icono={<FiClock />}  label="Fecha"     valor={detalle.fecha_reservacion} />
            <Fila icono={<FiClock />}  label="Hora"      valor={detalle.hora_reservacion} />
            <Fila icono={<FiUsers />}  label="Personas"  valor={detalle.cantidad_personas} />
            <Fila icono={<FiHash />}   label="Estado"    valor={<span className="capitalize">{detalle.estado_reservacion}</span>} />
            <div className="pt-1">
              <span className="font-medium text-gray-600 dark:text-gray-300">Mesas: </span>
              <span className="text-gray-800 dark:text-gray-100">
                {detalle.mesas?.map(m => `Mesa ${m.numero_mesa}`).join(', ')}
              </span>
            </div>
          </div>

          {!yaCancelada && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <FiAlertTriangle className="mt-0.5 w-4 h-4 shrink-0" />
              <p>Esta acción cancelará la reserva de forma permanente.</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 py-6">No se pudo cargar el detalle.</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-1"
        >
          <FiX /> Cerrar
        </button>

        {!yaCancelada && (
          <button
            onClick={() => onCancelada(reserva.id_reservacion)}
            disabled={guardando || cargandoDetalle}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors text-sm flex items-center gap-2"
          >
            {guardando
              ? <><FiLoader className="animate-spin" /> Cancelando...</>
              : "Cancelar Reserva"
            }
          </button>
        )}
      </div>
    </div>
  );
};

const Fila = ({ icono, label, valor }) => (
  <div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
    <span className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400">
      {icono} {label}
    </span>
    <span>{valor}</span>
  </div>
);

export default ModalCancelarReserva;