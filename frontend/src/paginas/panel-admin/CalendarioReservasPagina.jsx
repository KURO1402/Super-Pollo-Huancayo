// src/pages/reservas/componentes/CalendarioReservasSeccion.jsx

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';

import { useState, useRef, useEffect } from "react";
import { FiClock, FiUsers, FiLoader, FiCalendar } from "react-icons/fi";

import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import FormularioReserva from "../../componentes/panel-admin/reserva-panel/FormularioReservas"
import { ModalEditarReserva } from "../../componentes/panel-admin/reserva-panel/ModalEditarReserva";
import { listarReservacionesServicio } from "../../servicios/reservacionesServicio";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const CalendarioReservasPagina = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const calendarioRef = useRef(null);
  const modalNuevaReserva = useModal();
  const modalEditarReserva = useModal();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const reservaciones = await listarReservacionesServicio();
      setReservas(Array.isArray(reservaciones) ? reservaciones : []);
    } catch (error) {

      if (error.response?.status === 404) {
        setReservas([]);
        return;
      }
    } finally {
      setCargando(false);
    }
  };

  const esFechaValida = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);

    return fechaComparar >= hoy;
  };

  const convertirReservaAEvento = (reserva) => {
    const fecha = new Date(reserva.fechaReservacion);
    const fechaStr = fecha.toISOString().split('T')[0];

    return {
      id: reserva.idReservacion.toString(),
      title: `${reserva.nombresUsuario} - Mesa ${reserva.numeroMesa}`,
      start: fechaStr + 'T' + reserva.horaReservacion,
      extendedProps: {
        estado: reserva.estadoReservacion,
        hora: reserva.horaReservacion.substring(0, 5),
        cantidad: reserva.cantidadPersonas,
        mesa: reserva.numeroMesa,
        cliente: reserva.nombresUsuario
      },
      backgroundColor: getColorPorEstado(reserva.estadoReservacion),
      borderColor: getColorPorEstado(reserva.estadoReservacion),
      textColor: '#fff'
    };
  };

  const getColorPorEstado = (estado) => {
    const colores = {
      pendiente: '#f59e0b',
      pagado: '#10b981',
      cancelado: '#ef4444',
    };
    return colores[estado] || '#f59e0b';
  };

  const obtenerEstiloEstado = (estado) => {
    const estilos = {
      pendiente: {
        bg: "bg-yellow-50",
        border: "border-l-4 border-yellow-500",
        text: "text-yellow-900",
        badge: "bg-yellow-200 text-yellow-800",
      },
      pagado: {
        bg: "bg-green-50",
        border: "border-l-4 border-green-500",
        text: "text-green-900",
        badge: "bg-green-200 text-green-800",
      },
      cancelado: {
        bg: "bg-red-50",
        border: "border-l-4 border-red-500",
        text: "text-red-900",
        badge: "bg-red-200 text-red-800",
      }
    };
    return estilos[estado] || estilos.pendiente;
  };

  const getLabelEstado = (estado) => {
    const labels = {
      pendiente: "Pendiente",
      pagado: "Pagado",
      cancelado: "Cancelado"
    };
    return labels[estado] || "Pendiente";
  };

  const abrirNuevaReserva = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setReservaSeleccionada({
      fechaReservacion: hoy,
      horaReservacion: '12:00:00',
      estadoReservacion: 'pendiente'
    });
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

    setReservaSeleccionada({
      fechaReservacion: info.startStr.split('T')[0],
      horaReservacion: '12:00:00',
      estadoReservacion: 'pendiente'
    });
    modalNuevaReserva.abrir();
  };

  const manejarClickEvento = (info) => {
    const reserva = reservas.find((r) => r.idReservacion.toString() === info.event.id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      modalEditarReserva.abrir();
    }
  };

  const manejarGuardarNuevaReserva = async (datos) => {
    try {
      setGuardando(true);

      if (!esFechaValida(datos.fechaReservacion)) {
        mostrarAlerta.advertencia("No se pueden crear reservas para fechas anteriores a hoy");
        setGuardando(false);
        return;
      }

      const estadosPermitidos = ['pendiente', 'pagado', 'cancelado'];
      if (!estadosPermitidos.includes(datos.estadoReservacion)) {
        datos.estadoReservacion = 'pendiente';
      }

      const nuevaReserva = {
        ...datos,
        idReservacion: Date.now(),
        fechaCreacion: new Date().toISOString(),
        nombresUsuario: datos.nombreCliente || 'Cliente Nuevo',
        numeroMesa: datos.idMesa
      };
      setReservas((prev) => [...prev, nuevaReserva]);
      mostrarAlerta.exito("Reserva creada exitosamente");

      modalNuevaReserva.cerrar();
      setReservaSeleccionada(null);
    } catch (error) {
      mostrarAlerta.error("Error al guardar la reserva");
    } finally {
      setGuardando(false);
    }
  };

  const manejarGuardarReservaEditada = async (datosActualizados) => {
    try {
      setReservas((prev) => prev.map((r) =>
        r.idReservacion === datosActualizados.idReservacion
          ? { ...r, ...datosActualizados, numeroMesa: datosActualizados.idMesa }
          : r
      ));

      await cargarReservas();

      modalEditarReserva.cerrar();
      setReservaSeleccionada(null);
    } catch (error) {
      mostrarAlerta.error("Error al actualizar la reserva");
    }
  };

  const renderizarEvento = (info) => {
    const estado = info.event.extendedProps?.estado || "pendiente";
    const estilos = obtenerEstiloEstado(estado);
    const labelEstado = getLabelEstado(estado);

    return (
      <div className={`p-1.5 rounded ${estilos.bg} ${estilos.border} ${estilos.text} text-[11px] font-medium shadow-sm hover:shadow transition-all cursor-pointer`}>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="truncate font-semibold text-xs">{info.event.title}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${estilos.badge}`}>
            {labelEstado}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] opacity-90">
          <span className="flex items-center gap-0.5">
            <FiClock className="w-3 h-3" />
            {info.event.extendedProps?.hora}
          </span>
          <span className="flex items-center gap-0.5">
            <FiUsers className="w-3 h-3" />
            {info.event.extendedProps?.cantidad}
          </span>
        </div>
      </div>
    );
  };

  const eventosCalendario = reservas
    .filter(r => r.estadoReservacion !== "cancelado")
    .map(convertirReservaAEvento);

  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <FiCalendar className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario de Reservas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Visualiza y gestiona todas las reservas programadas
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Pagado</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FiLoader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando reservas...</p>
            </div>
          </div>
        ) : (
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
              validRange={{
                start: fechaMinima
              }}
              selectAllow={(selectInfo) => {
                const fechaSeleccionada = new Date(selectInfo.startStr);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                return fechaSeleccionada >= hoy; 
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}
              height="auto"
              dayMaxEvents={3}
              moreLinkContent={(args) => `+${args.num} más`}
            />
            {!cargando && reservas.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <FiCalendar className="mx-auto mb-2 w-10 h-10 opacity-50" />
                <p>No hay reservas registradas por el momento</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        estaAbierto={modalNuevaReserva.estaAbierto}
        onCerrar={modalNuevaReserva.cerrar}
        titulo="Nueva Reserva"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <FormularioReserva
          reservaInicial={reservaSeleccionada}
          reservas={reservas}
          onSubmit={manejarGuardarNuevaReserva}
          onCancelar={modalNuevaReserva.cerrar}
          guardando={guardando}
          estadosPermitidos={[
            { valor: 'pendiente', label: 'Pendiente' },
            { valor: 'pagado', label: 'Pagado' },
            { valor: 'cancelado', label: 'Cancelado' }
          ]}
        />
      </Modal>

      <Modal
        estaAbierto={modalEditarReserva.estaAbierto}
        onCerrar={modalEditarReserva.cerrar}
        titulo={`Editar Reserva #${reservaSeleccionada?.idReservacion || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {reservaSeleccionada && (
          <ModalEditarReserva
            idReservacion={reservaSeleccionada.idReservacion}
            onClose={modalEditarReserva.cerrar}
            onGuardar={manejarGuardarReservaEditada}
          />
        )}
      </Modal>
    </div>
  );
};

export default CalendarioReservasPagina;