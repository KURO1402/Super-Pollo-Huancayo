import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiRefreshCw, FiUsers, FiDollarSign, FiMapPin, FiEye, FiEyeOff, FiCopy, FiCheck } from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock, FaRegTimesCircle, FaRegCalendarAlt } from "react-icons/fa";
import { obtenerReservacionesPorUsuario } from "../../servicios/reservacionesServicio";

const MisReservaciones = () => {
  const [filtro, setFiltro] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reservaciones, setReservaciones] = useState([]);
  const [codigosMostrados, setCodigosMostrados] = useState({});
  const [copiados, setCopiados] = useState({});

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
      if (err.status === 404) {
        setReservaciones([]);
        setError(null);
        return;
      }
      if (err.status === 403) {
        setError("No tienes permisos para ver las reservaciones. Por favor, inicia sesión nuevamente.");
      } else if (err.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setError("Error al cargar las reservaciones. Por favor, intenta nuevamente.");
      }
      setReservaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const toggleMostrarCodigo = (id) => {
    setCodigosMostrados(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copiarCodigo = (codigo, id) => {
    navigator.clipboard.writeText(codigo).then(() => {
      setCopiados(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiados(prev => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case "pagado":
        return {
          icono: <FiDollarSign className="w-4 h-4" />,
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          barra: "bg-emerald-500",
          texto: "Pagado"
        };
      case "confirmada":
        return {
          icono: <FaRegCheckCircle className="w-4 h-4" />,
          color: "bg-green-500/20 text-green-400 border-green-500/40",
          barra: "bg-green-500",
          texto: "Confirmada"
        };
      case "completado":
        return {
          icono: <FaRegCheckCircle className="w-4 h-4" />,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          barra: "bg-blue-500",
          texto: "Completado"
        };
      case "pendiente":
        return {
          icono: <FaRegClock className="w-4 h-4" />,
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
          barra: "bg-yellow-500",
          texto: "Pendiente"
        };
      case "cancelada":
      case "cancelado":
        return {
          icono: <FaRegTimesCircle className="w-4 h-4" />,
          color: "bg-red-500/20 text-red-400 border-red-500/40",
          barra: "bg-red-500",
          texto: "Cancelada"
        };
      default:
        return {
          icono: <FaRegClock className="w-4 h-4" />,
          color: "bg-gray-500/20 text-gray-400 border-gray-500/40",
          barra: "bg-gray-500",
          texto: estado || "Desconocido"
        };
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    const [dia, mes, anio] = fecha.split("-");
    const fechaObj = new Date(`${anio}-${mes}-${dia}`);
    return fechaObj.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const debeOcultarCodigo = (codigo) => codigo === "******";

  const reservacionesFiltradas = filtro === "todas"
    ? reservaciones
    : reservaciones.filter((res) => res.estado_reservacion === filtro);

  if (cargando) {
    return (
      <section className="bg-azul-secundario relative w-full min-h-screen py-20 md:py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #f4b942 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-20 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-azul-secundario relative w-full min-h-screen py-20 md:py-24 lg:py-32 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #f4b942 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12 opacity-0 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-amarillo" />
            <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">MIS RESERVAS</span>
            <span className="block w-8 h-px bg-amarillo" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            MIS{" "}
            <span className="text-rojo relative inline-block">
              RESERVACIONES
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-rojo rounded-full opacity-50" />
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6">
            Gestiona y revisa todas tus reservas en Super Pollo
          </p>
          <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 opacity-0 animate-fade-up delay-100 backdrop-blur-sm">
            <p className="flex items-center gap-2">
              <FaRegTimesCircle className="text-red-400" />
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 opacity-0 animate-fade-up delay-200">
          <div className="flex gap-2 flex-wrap">
            {[
              { valor: "todas", etiqueta: "Todas", color: "bg-rojo" },
              { valor: "pendiente", etiqueta: "Pendientes", color: "bg-yellow-500" },
              { valor: "confirmada", etiqueta: "Confirmadas", color: "bg-green-500" },
              { valor: "cancelado", etiqueta: "Canceladas", color: "bg-red-500" },
            ].map(({ valor, etiqueta, color }) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${filtro === valor
                    ? `${color} text-white shadow-lg transform scale-105`
                    : "bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700 border border-white/10"
                  }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
          <button
            onClick={cargarReservaciones}
            className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <FiRefreshCw className="w-4 h-4" />
            Recargar
          </button>
        </div>

        <div className="space-y-4">
          {reservacionesFiltradas.map((reserva, index) => {
            const config = getEstadoConfig(reserva.estado_reservacion);
            const mostrarCodigo = codigosMostrados[reserva.id_reservacion];
            const esPendiente = reserva.estado_reservacion === "pendiente";
            const codigoOculto = debeOcultarCodigo(reserva.codigo_reservacion);
            const codigoCopiad = copiados[reserva.id_reservacion];

            return (
              <div
                key={reserva.id_reservacion}
                className="relative opacity-0 animate-fade-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="absolute -inset-2 border border-rojo/10 rounded-2xl z-0 hidden md:block" />
                <div className="absolute -inset-4 border border-amarillo/5 rounded-3xl z-0 hidden md:block" />

                <div className="relative bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className={`h-1 w-full ${config.barra}`} />

                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                      {esPendiente && !codigoOculto ? (
                        <button
                          onClick={() => toggleMostrarCodigo(reserva.id_reservacion)}
                          className="px-4 py-2 bg-amarillo/10 hover:bg-amarillo/20 text-amarillo border border-amarillo/30 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                        >
                          {mostrarCodigo ? (
                            <><FiEyeOff className="w-4 h-4" />Ocultar código</>
                          ) : (
                            <><FiEye className="w-4 h-4" />Ver código de reservación</>
                          )}
                        </button>
                      ) : (
                        <div />
                      )}

                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.color} flex-shrink-0`}>
                        {config.icono}
                        {config.texto}
                      </span>
                    </div>

                    {esPendiente && !codigoOculto && mostrarCodigo && (
                      <div className="bg-gray-800/50 border border-amarillo/30 rounded-lg p-4 mb-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Código de reservación</p>
                            <p className="font-mono text-2xl font-bold text-amarillo tracking-wider">
                              {reserva.codigo_reservacion}
                            </p>
                          </div>
                          <button
                            onClick={() => copiarCodigo(reserva.codigo_reservacion, reserva.id_reservacion)}
                            className={`p-3 rounded-lg transition-all duration-300 ${codigoCopiad
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-amarillo/10 hover:bg-amarillo/20 text-amarillo'
                              }`}
                            title="Copiar código"
                          >
                            {codigoCopiad ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                      <div className="flex items-center gap-3 bg-gray-800/50 border border-white/5 rounded-xl px-4 py-3">
                        <FaRegCalendarAlt className="text-amarillo text-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Fecha</p>
                          <p className="text-sm text-gray-200 font-medium capitalize">{formatearFecha(reserva.fecha_reservacion)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-800/50 border border-white/5 rounded-xl px-4 py-3">
                        <FiClock className="text-amarillo text-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Hora</p>
                          <p className="text-sm text-gray-200 font-medium">{reserva.hora_reservacion}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-800/50 border border-white/5 rounded-xl px-4 py-3">
                        <FiUsers className="text-amarillo text-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Personas</p>
                          <p className="text-sm text-gray-200 font-medium">{reserva.cantidad_personas} personas</p>
                        </div>
                      </div>
                    </div>

                    {reserva.mesas?.length > 0 && (
                      <>
                        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-4" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FiMapPin className="text-amarillo flex-shrink-0" />
                            Mesas reservadas
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            {reserva.mesas.map((mesa) => (
                              <div
                                key={mesa.numero_mesa}
                                className="flex items-center gap-3 bg-gray-800/50 border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 transition-all"
                              >
                                <div className="w-10 h-10 bg-linear-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center border border-yellow-500/30 flex-shrink-0">
                                  <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="7" width="18" height="4" rx="1" />
                                    <line x1="5" y1="11" x2="5" y2="18" />
                                    <line x1="19" y1="11" x2="19" y2="18" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white">Mesa {mesa.numero_mesa}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {reservacionesFiltradas.length === 0 && !error && (
          <div className="text-center py-16 opacity-0 animate-fade-up delay-300">
            <div className="w-20 h-20 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border border-white/10">
              <FiCalendar className="w-10 h-10 text-amarillo" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay reservaciones</h3>
            <p className="text-gray-400 text-sm mb-6">
              {filtro === "todas"
                ? "Aún no has realizado ninguna reservación"
                : `No hay reservaciones ${filtro === "pendiente" ? "pendientes" : filtro === "confirmada" ? "confirmadas" : "canceladas"}`}
            </p>
            <Link
              to="/usuario/nueva-reservacion"
              className="inline-flex items-center gap-2 bg-linear-to-r from-rojo to-rojo/80 hover:from-rojo/90 hover:to-rojo text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <FiCalendar />
              Realizar mi primera reservación
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisReservaciones;