import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiRefreshCw } from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock, FaRegTimesCircle } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { obtenerReservacionesPorUsuario } from "../../servicios/reservacionesServicio";

const MisReservaciones = () => {
  const [filtro, setFiltro] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reservaciones, setReservaciones] = useState([]);

  useEffect(() => { cargarReservaciones(); }, []);

  const cargarReservaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerReservacionesPorUsuario();
      if (respuesta.ok && respuesta.reservaciones) {
        setReservaciones(respuesta.reservaciones);
      } else {
        setError("No se pudieron cargar las reservaciones");
        setReservaciones([]);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("No tienes permisos para ver las reservaciones. Por favor, inicia sesión nuevamente.");
      } else if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setError("Error al cargar las reservaciones. Por favor, intenta nuevamente.");
      }
      setReservaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case "pagado":     return { icono: <FiDollarSign className="w-3.5 h-3.5" />,       color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", barra: "bg-emerald-500" };
      case "confirmada": return { icono: <FaRegCheckCircle className="w-3.5 h-3.5" />,   color: "bg-green-500/15 text-green-400 border border-green-500/30",       barra: "bg-green-500" };
      case "completado": return { icono: <FaRegCheckCircle className="w-3.5 h-3.5" />,   color: "bg-blue-500/15 text-blue-400 border border-blue-500/30",           barra: "bg-blue-500" };
      case "pendiente":  return { icono: <FaRegClock className="w-3.5 h-3.5" />,         color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",     barra: "bg-yellow-500" };
      case "cancelada":  return { icono: <FaRegTimesCircle className="w-3.5 h-3.5" />,   color: "bg-red-500/15 text-red-400 border border-red-500/30",               barra: "bg-red-500" };
      default:           return { icono: <FaRegClock className="w-3.5 h-3.5" />,         color: "bg-gray-500/15 text-gray-400 border border-gray-500/30",           barra: "bg-gray-500" };
    }
  };

  const formatearEstado = (estado) => {
    const estados = { pagado: "Pagado", pendiente: "Pendiente", confirmada: "Confirmada", cancelada: "Cancelada", completado: "Completado" };
    return estados[estado] || estado;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    const [dia, mes, anio] = fecha.split("-");
    return new Date(`${anio}-${mes}-${dia}`).toLocaleDateString("es-ES", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const reservacionesFiltradas = filtro === "todas"
    ? reservaciones
    : reservaciones.filter((res) => res.estado_reservacion === filtro);

  if (cargando) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            MIS <span className="text-rojo">RESERVACIONES</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestiona y revisa todas tus reservas en Super Pollo
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            {[
              { valor: "todas",      etiqueta: "Todas",        color: "bg-azul-primario" },
              { valor: "pendiente",  etiqueta: "Pendientes",   color: "bg-yellow-500" },
              { valor: "confirmada", etiqueta: "Confirmadas",  color: "bg-green-500" },
              { valor: "completado", etiqueta: "Completadas",  color: "bg-blue-500" },
              { valor: "pagado",     etiqueta: "Pagadas",      color: "bg-emerald-500" },
              { valor: "cancelada",  etiqueta: "Canceladas",   color: "bg-red-500" },
            ].map(({ valor, etiqueta, color }) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
                  filtro === valor ? `${color} text-white shadow-md` : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
          <button
            onClick={cargarReservaciones}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Recargar
          </button>
        </div>

        <div className="space-y-2">
          {reservacionesFiltradas.map((reserva) => {
            const config = getEstadoConfig(reserva.estado_reservacion);
            return (
              <div
                key={reserva.id_reservacion}
                className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 hover:border-gray-600 hover:bg-gray-750 transition-all duration-200"
              >
                <div className={`w-1 h-10 rounded-full shrink-0 ${config.barra}`} />

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FiCalendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-white capitalize truncate">
                      {formatearFecha(reserva.fecha_reservacion)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{reserva.hora_reservacion}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 font-mono hidden sm:block">
                    #{reserva.id_reservacion}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.color}`}>
                    {config.icono}
                    {formatearEstado(reserva.estado_reservacion)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {reservacionesFiltradas.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No hay reservaciones</h3>
            <p className="text-gray-400 text-sm mb-6">
              {filtro === "todas"
                ? "Aún no has realizado ninguna reservación"
                : `No hay reservaciones ${formatearEstado(filtro).toLowerCase()}s`}
            </p>
            <Link
              to="/usuario/nueva-reservacion"
              className="inline-block bg-rojo hover:bg-rojo/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            >
              Realizar mi primera reservación
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisReservaciones;