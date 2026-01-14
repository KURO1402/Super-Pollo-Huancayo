import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { useBusqueda } from "../../hooks/useBusqueda";
import { useFiltro } from "../../hooks/useFiltro";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { ModalDetalleReserva } from "../../componentes/panel-admin/reserva-panel/ModalDetalleReserva";
import { ModalEditarReserva } from "../../componentes/panel-admin/reserva-panel/ModalEditarReserva";
import { FilaReserva } from "../../componentes/panel-admin/reserva-panel/FilaReserva";
import { 
  listarReservacionesServicio,
  obtenerDetalleReservacionServicio,
  actualizarReservacionServicio
} from "../../servicios/reservacionesServicio";

const HistorialReservasPagina = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina, 
    setItemsPorPagina, 
    paginar 
  } = usePaginacion(5);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalleReserva, setDetalleReserva] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  
  const modalDetalle = useModal(false);
  const modalEditar = useModal(false);

  useEffect(() => {
    cargarReservaciones();
  }, []);

  const cargarReservaciones = async () => {
    try {
      setCargando(true);
      const reservaciones = await listarReservacionesServicio();
      setReservas(reservaciones);
    } catch (error) {

    } finally {
      setCargando(false);
    }
  };

  const cargarDetalleReserva = async (idReservacion) => {
    try {
      setCargandoDetalle(true);
      const respuesta = await obtenerDetalleReservacionServicio(idReservacion);

      if (respuesta.ok) {
        setDetalleReserva({
          detalles: respuesta.detalle
        });
      }
    } catch (error) {
      mostrarAlerta.error("Error al obtener el detalle de la reserva");
    } finally {
      setCargandoDetalle(false);
    }
  };

  let filtrados = filtrarPorBusqueda(reservas, [
    "nombresUsuario",
    "numeroMesa",
    "estadoReservacion"
  ]);

  filtrados = aplicarFiltros(filtrados, "estadoReservacion");
  const { datosPaginados, totalPaginas } = paginar(filtrados);

  const handleActualizarReserva = async (datosActualizados) => {
    try {
      const respuesta = await actualizarReservacionServicio(
        datosActualizados.idReservacion, 
        datosActualizados
      );
      
      if (respuesta.ok) {
        setReservas(prevReservas => 
          prevReservas.map(reserva => 
            reserva.idReservacion === datosActualizados.idReservacion 
              ? { ...reserva, ...datosActualizados }
              : reserva
          )
        );
        modalEditar.cerrar();
      } else {
        throw new Error(respuesta.mensaje || "Error al actualizar reservación");
      }
      
    } catch (error) {

    }
  };

  const handleCancelarReserva = async (reserva) => {
    if (confirm(`¿Estás seguro de cancelar la reserva #${reserva.idReservacion}?`)) {
      try {
        const datosActualizados = {
          ...reserva,
          estadoReservacion: 'cancelado'
        };
        
        const respuesta = await actualizarReservacionServicio(
          reserva.idReservacion, 
          datosActualizados
        );
        
        if (respuesta.ok) {
          setReservas(prevReservas => 
            prevReservas.map(r => 
              r.idReservacion === reserva.idReservacion 
                ? { ...r, estadoReservacion: 'cancelado' }
                : r
            )
          );
          
          alert('Reserva cancelada correctamente');
        } else {
          throw new Error(respuesta.mensaje || "Error al cancelar reservación");
        }
        
      } catch (error) {
        alert('Error al cancelar la reserva: ' + error.message);
      }
    }
  };

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  const handleVerDetalle = async (reserva) => {
    setReservaSeleccionada(reserva);
    await cargarDetalleReserva(reserva.idReservacion);
    modalDetalle.abrir();
  };

  const handleEditar = (reserva) => {
    setReservaSeleccionada(reserva);
    modalEditar.abrir();
  };

  const filasReservas = datosPaginados.map((reserva) => (
    <FilaReserva 
      key={reserva.idReservacion} 
      reserva={reserva}
      onVerDetalle={handleVerDetalle}
      onEditar={handleEditar}
      onCancelar={handleCancelarReserva}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <FaCalendarAlt className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Reservas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gestión y control de todas las reservas del restaurante
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por cliente, mesa o estado..."
          />
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro}
            opciones={[
              { value: "todos", label: "Todas las reservas" },
              { value: "pagado", label: "Pagadas" },
              { value: "pendiente", label: "Pendientes" },
              { value: "cancelado", label: "Canceladas" },
            ]}
          />
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando reservas...</p>
        </div>
      ) : (
        <>
          <Tabla
            encabezados={["Reserva", "Cliente", "Detalles", "Estado", "Acciones"]}
            registros={filasReservas}
          />

          {datosPaginados.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {reservas.length === 0 ? "No hay reservas registradas" : "No se encontraron reservas que coincidan con la búsqueda"}
            </div>
          )}

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={handleCambiarPagina}
            itemsPorPagina={itemsPorPagina}
            alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
            mostrarSiempre={true}
          />
        </>
      )}

      <Modal
        estaAbierto={modalDetalle.estaAbierto}
        onCerrar={modalDetalle.cerrar}
        titulo={`Detalle de Reserva #${reservaSeleccionada?.idReservacion || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {cargandoDetalle ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Cargando detalle de la reserva...
          </div>
        ) : (
          reservaSeleccionada && (
            <ModalDetalleReserva 
              reserva={reservaSeleccionada}
              detalle={detalleReserva}
              onClose={modalDetalle.cerrar}
            />
          )
        )}
      </Modal>

      <Modal
        estaAbierto={modalEditar.estaAbierto}
        onCerrar={modalEditar.cerrar}
        titulo={`Editar Reserva #${reservaSeleccionada?.idReservacion || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {reservaSeleccionada && (
          <ModalEditarReserva 
            idReservacion={reservaSeleccionada.idReservacion}
            onClose={modalEditar.cerrar}
            onGuardar={handleActualizarReserva}
          />
        )}
      </Modal>
    </div>
  );
};

export default HistorialReservasPagina;