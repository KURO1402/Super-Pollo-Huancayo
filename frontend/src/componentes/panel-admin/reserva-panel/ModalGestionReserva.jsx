import { FiHash, FiUsers, FiClock, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";
import { useConfirmacion } from "../../../hooks/useConfirmacion";
import { ModalConfirmacion } from "../../ui/modal/ModalConfirmacion";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const enVentanaConfirmacion = (fechaStr, horaStr) => {
  if (!fechaStr || !horaStr) return false;
  const [dia, mes, anio] = fechaStr.split('-').map(Number); 
  const [hora, min] = horaStr.split(':').map(Number);
  const msReserva = new Date(anio, mes - 1, dia, hora, min, 0, 0).getTime();
  const ahora = Date.now();
  return ahora >= msReserva - 15 * 60 * 1000 && ahora <= msReserva + 30 * 60 * 1000;
};

const ModalGestionReserva = ({ onCerrar, onAccion }) => {
  const {
    reservacionBuscada,
    cargandoBusqueda,
    guardando,
    cancelarReservacion,
    confirmarReservacion,
  } = useReservacionAdminStore();

  const {
    confirmacionVisible,
    mensajeConfirmacion,
    tituloConfirmacion,
    tipoConfirmacion,
    textoConfirmar,
    textoCancelar,
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion,
  } = useConfirmacion();

  const detalle = reservacionBuscada;

  const manejarCancelar = () => {
    solicitarConfirmacion(
      `¿Estás seguro de cancelar la reserva? Esta acción no se puede deshacer.`,
      async () => {
        await cancelarReservacion(detalle.id_reservacion);
        mostrarAlerta.exito('Reserva cancelada exitosamente');
        onAccion();
      },
      {
        titulo: 'Cancelar Reserva',
        tipo: 'peligro',
        textoConfirmar: 'Sí, cancelar',
        textoCancelar: 'No, volver',
      }
    );
  };

  const manejarConfirmar = async () => {
    try {
      await confirmarReservacion(detalle.id_reservacion);
      mostrarAlerta.exito('Reserva confirmada exitosamente');
      onAccion();
    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al confirmar la reservación');
    }
  };

  const yaCancelada  = detalle?.estado_reservacion === 'cancelado';
  const yaConfirmada = detalle?.estado_reservacion === 'confirmado' || detalle?.estado_reservacion === 'completado';
  const puedeConfirmar = enVentanaConfirmacion(detalle?.fecha_reservacion, detalle?.hora_reservacion);

  if (cargandoBusqueda) {
    return (
      <div className="flex items-center justify-center py-10">
        <FiLoader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!detalle) {
    return <p className="text-center text-gray-500 py-6">No se pudo cargar el detalle.</p>;
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 text-sm">
          <Fila icono={<FiUsers />} label="Cliente"  valor={detalle.usuario} />
          <Fila icono={<FiClock />} label="Fecha"    valor={detalle.fecha_reservacion} />
          <Fila icono={<FiClock />} label="Hora"     valor={detalle.hora_reservacion} />
          <Fila icono={<FiUsers />} label="Personas" valor={detalle.cantidad_personas} />
          <Fila
            icono={<FiHash />}
            label="Estado"
            valor={<span className="capitalize">{detalle.estado_reservacion}</span>}
          />
          <div className="pt-1">
            <span className="font-medium text-gray-600 dark:text-gray-300">Mesas: </span>
            <span className="text-gray-800 dark:text-gray-100">
              {detalle.mesas?.map(m => `Mesa ${m.numero_mesa}`).join(', ')}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {!yaCancelada && !yaConfirmada && (
            <>
              <button
                type="button"
                onClick={manejarCancelar}
                disabled={guardando}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors text-sm flex items-center gap-2"
              >
                {guardando ? <FiLoader className="animate-spin w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                Cancelar Reserva
              </button>

              <div className="relative group">
                <button
                  type="button"
                  onClick={manejarConfirmar}
                  disabled={!puedeConfirmar || guardando}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
                >
                  {guardando ? <FiLoader className="animate-spin w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                  Confirmar Reserva
                </button>
                {!puedeConfirmar && (
                  <div className="absolute bottom-full right-0 mb-2 w-52 px-3 py-2 rounded-lg bg-gray-800 text-white text-xs text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    Aún no se puede confirmar esta reserva
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </div>
            </>
          )}

          {yaCancelada && (
            <span className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
              Esta reserva ya fue cancelada
            </span>
          )}
          {yaConfirmada && (
            <span className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm border border-green-200">
              Esta reserva ya fue confirmada
            </span>
          )}
        </div>
      </div>

      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        tipo={tipoConfirmacion}
        textoConfirmar={textoConfirmar}
        textoCancelar={textoCancelar}
      />
    </>
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

export default ModalGestionReserva;