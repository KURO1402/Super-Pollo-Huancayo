import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';

import { useState, useRef, useCallback } from "react";
import { FiClock, FiCalendar } from "react-icons/fi";

import { useReservacionAdminStore } from "../../store/useReservacionAdminStore";
import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import FormularioReservaManual from "../../componentes/panel-admin/reserva-panel/FormularioReservaManual";
import ModalDetalleReserva from "../../componentes/panel-admin/reserva-panel/ModalDetalleReserva";
import BuscadorReservacion from "../../componentes/panel-admin/reserva-panel/BuscadorReservacion";
import ModalGestionReserva from "../../componentes/panel-admin/reserva-panel/ModalGestionReserva";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const CalendarioReservasPagina = () => {
  const {
    reservaciones,
    guardando,
    cargarReservacionesPorRango,
    crearReservacionManual,
    cancelarReservacion,
    limpiarReservacionBuscada,
  } = useReservacionAdminStore();

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [fechaInicialForm, setFechaInicialForm] = useState(null);

  const calendarioRef = useRef(null);
  const modalNuevaReserva = useModal();
  const modalDetalleReserva = useModal();
  const modalGestionReserva = useModal();

  const cargandoRef = useRef(false);
  const rangoActualRef = useRef(null);

  const manejarCambioDeFechas = useCallback((rangoInfo) => {
    const fechaInicio = rangoInfo.startStr.split('T')[0];
    const fechaFin = rangoInfo.endStr.split('T')[0];

    const rangoKey = `${fechaInicio}_${fechaFin}`;
    if (cargandoRef.current || rangoActualRef.current === rangoKey) return;

    rangoActualRef.current = rangoKey;
    cargandoRef.current = true;

    cargarReservacionesPorRango(fechaInicio, fechaFin).finally(() => {
      cargandoRef.current = false;
    });
  }, [cargarReservacionesPorRango]);

  const convertirReservaAEvento = (reserva) => {
    const [dia, mes, anio] = reserva.fecha_reservacion.split('-');
    const fechaISO = `${anio}-${mes}-${dia}`;
    return {
      id: reserva.id_reservacion.toString(),
      title: `Reserva #${reserva.id_reservacion}`,
      start: `${fechaISO}T${reserva.hora_reservacion}`,
      extendedProps: {
        estado: reserva.estado_reservacion,
        hora: reserva.hora_reservacion,
      },
      backgroundColor: getColorPorEstado(reserva.estado_reservacion),
      borderColor: getColorPorEstado(reserva.estado_reservacion),
      textColor: '#fff'
    };
  };

  const getColorPorEstado = (estado) => {
    const colores = {
      pendiente: '#f59e0b',
      completado: '#3b82f6',
      cancelado:  '#ef4444',
    };
    return colores[estado] || '#f59e0b';
  };

  const obtenerEstiloEstado = (estado) => {
    const estilos = {
      pendiente:  { bg: "bg-yellow-50", border: "border-l-4 border-yellow-500", text: "text-yellow-900", badge: "bg-yellow-200 text-yellow-800" },
      pagado:     { bg: "bg-green-50",  border: "border-l-4 border-green-500",  text: "text-green-900",  badge: "bg-green-200 text-green-800"  },
      completado: { bg: "bg-blue-50",   border: "border-l-4 border-blue-500",   text: "text-blue-900",   badge: "bg-blue-200 text-blue-800"    },
      cancelado:  { bg: "bg-red-50",    border: "border-l-4 border-red-500",    text: "text-red-900",    badge: "bg-red-200 text-red-800"      },
    };
    return estilos[estado] || estilos.pendiente;
  };

  const getLabelEstado = (estado) => {
    const labels = { pendiente: "Pendiente", pagado: "Pagado", completado: "Completado", cancelado: "Cancelado" };
    return labels[estado] || estado;
  };

  const abrirNuevaReserva = () => {
    setFechaInicialForm(new Date().toISOString().split('T')[0]);
    modalNuevaReserva.abrir();
  };

  const manejarSeleccionFecha = (info) => {
    const fechaSel = new Date(info.startStr);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSel < hoy) {
      mostrarAlerta.advertencia("No se pueden reservar fechas anteriores a hoy");
      return;
    }
    setFechaInicialForm(info.startStr.split('T')[0]);
    modalNuevaReserva.abrir();
  };

  const manejarClickEvento = (info) => {
    const reserva = reservaciones.find(
      (r) => r.id_reservacion.toString() === info.event.id
    );
    if (reserva) {
      setReservaSeleccionada(reserva);
      modalDetalleReserva.abrir();
    }
  };

  const manejarGuardarNuevaReserva = async (datos) => {
    try {
      await crearReservacionManual(datos);
      mostrarAlerta.exito("Reserva creada exitosamente");
      modalNuevaReserva.cerrar();
      setFechaInicialForm(null);

      rangoActualRef.current = null;
      const api = calendarioRef.current?.getApi();
      if (api) {
        const { activeStart, activeEnd } = api.view;
        await cargarReservacionesPorRango(
          activeStart.toISOString().split('T')[0],
          activeEnd.toISOString().split('T')[0]
        );
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al guardar la reserva");
      console.log(error.message)
    }
  };

  const manejarReservaEncontrada = () => {
    modalGestionReserva.abrir();
  };

  const manejarAccionGestion = () => {
    modalGestionReserva.cerrar();
    limpiarReservacionBuscada();
    rangoActualRef.current = null;
    const api = calendarioRef.current?.getApi();
    if (api) {
      const { activeStart, activeEnd } = api.view;
      cargarReservacionesPorRango(
        activeStart.toISOString().split('T')[0],
        activeEnd.toISOString().split('T')[0]
      );
    }
  };

  const renderizarEvento = (info) => {
    const estado = info.event.extendedProps?.estado || "pendiente";
    const estilos = obtenerEstiloEstado(estado);
    return (
      <div className={`p-1.5 rounded ${estilos.bg} ${estilos.border} ${estilos.text} text-[11px] font-medium shadow-sm hover:shadow transition-all cursor-pointer`}>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="truncate font-semibold text-xs">{info.event.title}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${estilos.badge}`}>
            {getLabelEstado(estado)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] opacity-90">
          <FiClock className="w-3 h-3" />
          {info.event.extendedProps?.hora}
        </div>
      </div>
    );
  };

  const eventosCalendario = reservaciones.map(convertirReservaAEvento);

  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <FiCalendar className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario de Reservas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Visualiza y gestiona todas las reservas programadas</p>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">
            Buscar reservación por código:
          </p>
          <BuscadorReservacion onEncontrada={manejarReservaEncontrada} />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { color: 'bg-yellow-500', label: 'Pendiente' },
            { color: 'bg-blue-500',   label: 'Completado'},
            { color: 'bg-red-500',    label: 'Cancelado' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 ${color} rounded`}></div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="calendar-wrapper p-4">
          <FullCalendar
            ref={calendarioRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            headerToolbar={{
              left: "prev,next btnNuevaReserva",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={eventosCalendario}
            datesSet={manejarCambioDeFechas}
            selectable={true}
            select={manejarSeleccionFecha}
            eventClick={manejarClickEvento}
            eventContent={renderizarEvento}
            customButtons={{
              btnNuevaReserva: {
                text: "+ Nueva Reserva",
                click: abrirNuevaReserva,
              },
            }}
            /* selectAllow={(selectInfo) => {
              const fechaSeleccionada = new Date(selectInfo.startStr);
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              return fechaSeleccionada >= hoy;
            }} */
            buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
            height="auto"
            dayMaxEvents={3}
            moreLinkContent={(args) => `+${args.num} más`}
          />
        </div>
      </div>

      <Modal
        estaAbierto={modalNuevaReserva.estaAbierto}
        onCerrar={modalNuevaReserva.cerrar}
        titulo="Nueva Reserva Manual"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <FormularioReservaManual
          fechaInicial={fechaInicialForm}
          onSubmit={manejarGuardarNuevaReserva}
          onCancelar={modalNuevaReserva.cerrar}
          guardando={guardando}
        />
      </Modal>

      <Modal
        estaAbierto={modalDetalleReserva.estaAbierto}
        onCerrar={modalDetalleReserva.cerrar}
        titulo={`Detalle de la reservación`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {reservaSeleccionada && (
          <ModalDetalleReserva
            reserva={reservaSeleccionada}
            onClose={modalDetalleReserva.cerrar}
          />
        )}
      </Modal>
      <Modal
        estaAbierto={modalGestionReserva.estaAbierto}
        onCerrar={() => {
          modalGestionReserva.cerrar();
          limpiarReservacionBuscada();
        }}
        titulo="Gestión de Reserva"
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalGestionReserva
          onCerrar={() => {
            modalGestionReserva.cerrar();
            limpiarReservacionBuscada();
          }}
          onAccion={manejarAccionGestion}
        />
      </Modal>
    </div>
  );
};

export default CalendarioReservasPagina;