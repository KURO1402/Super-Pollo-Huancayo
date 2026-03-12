import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiMapPin, 
  FiRefreshCw,
  FiDollarSign
} from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock, FaRegTimesCircle } from "react-icons/fa";
import { obtenerReservacionesPorUsuario } from "../../servicios/reservacionesServicio";

const MisReservaciones = () => {
  const [filtro, setFiltro] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const reservaciones = [
  {
    idReservacion: 1,
    estado: 'confirmada',
    fecha_registro: '2023-01-15',
    fecha: '2023-01-20',
    hora: '18:00',
    numero_personas: 4,
    mesa: 12,
  },
  {
    idReservacion: 2,
    estado: 'pendiente',
    fecha_registro: '2023-01-16',
    fecha: '2023-01-21',
    hora: '20:00',
    numero_personas: 2,
    mesa: 5,
  },
  {
    idReservacion: 3,
    estado: 'cancelada',
    fecha_registro: '2023-01-17',
    fecha: '2023-01-22',
    hora: '19:30',
    numero_personas: 3,
    mesa: 9,
  },
  {
    idReservacion: 4,
    estado: 'pagado',
    fecha_registro: '2023-01-18',
    fecha: '2023-01-23',
    hora: '17:00',
    numero_personas: 6,
    mesa: 1,
  }
];


  
  useEffect(() => {
    cargarReservaciones();
  }, []);

  const cargarReservaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerReservacionesPorUsuario();
      
      if (respuesta.ok && respuesta.reservas) {
        setReservaciones(respuesta.reservas);
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

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "pagado":
        return <FiDollarSign className="w-5 h-5 text-green-500" />;
      case "confirmada":
        return <FaRegCheckCircle className="w-5 h-5 text-green-500" />;
      case "pendiente":
        return <FaRegClock className="w-5 h-5 text-yellow-500" />;
      case "cancelada":
        return <FaRegTimesCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FaRegClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pagado":
        return "bg-green-900/30 text-green-400";
      case "confirmada":
        return "bg-green-900/30 text-green-400";
      case "pendiente":
        return "bg-yellow-900/30 text-yellow-400";
      case "cancelada":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-gray-900/30 text-gray-400";
    }
  };

  const formatearEstado = (estado) => {
    const estados = {
      'pagado': 'Pagado',
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada'
    };
    return estados[estado] || estado;
  };

  const formatearFecha = (fecha) => {
    const [day, month, year] = fecha.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  const reservacionesFiltradas = filtro === "todas" 
    ? reservaciones 
    : reservaciones.filter(res => res.estado === filtro);


  if (cargando) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-12"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            MIS <span className="text-rojo">RESERVACIONES</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestiona y revisa todas tus reservas en Super Pollo
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFiltro("todas")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "todas" 
                      ? "bg-azul-primario text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltro("pagado")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "pagado" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Pagadas
                </button>
                <button
                  onClick={() => setFiltro("pendiente")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "pendiente" 
                      ? "bg-yellow-500 text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={cargarReservaciones}
                className="flex items-center gap-2 bg-azul-primario hover:bg-azul-primario/90 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <FiRefreshCw className="w-5 h-5" />
                Recargar
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {reservacionesFiltradas.map((reserva) => (
            <div 
              key={reserva.idReservacion}
              className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcono(reserva.estado)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                          {formatearEstado(reserva.estado)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 font-mono">
                        ID: {reserva.idReservacion}
                      </span>
                      <span className="text-sm text-gray-400">
                        Registrada: {reserva.fecha_registro}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                          <FiCalendar className="w-5 h-5 text-azul-primario" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Fecha</p>
                          <p className="font-semibold text-white">
                            {formatearFecha(reserva.fecha).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rojo/10 rounded-lg flex items-center justify-center">
                          <FiClock className="w-5 h-5 text-rojo" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Hora</p>
                          <p className="font-semibold text-white">{reserva.hora}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Personas</p>
                          <p className="font-semibold text-white">{reserva.numero_personas}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Mesa</p>
                          <p className="font-semibold text-white">Mesa {reserva.mesa}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reservacionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay reservaciones
            </h3>
            <p className="text-gray-400 mb-6">
              {filtro === "todas" 
                ? "Aún no has realizado ninguna reservación" 
                : `No hay reservaciones ${formatearEstado(filtro).toLowerCase()}s`}
            </p>
            <Link to="/usuario/nueva-reservacion">
              <button className="bg-rojo hover:bg-rojo/90 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105">
                Realizar mi primera reservación
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisReservaciones;