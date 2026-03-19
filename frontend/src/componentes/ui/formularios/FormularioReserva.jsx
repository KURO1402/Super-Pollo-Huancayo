import { useState } from "react";
import { FaCalendarAlt, FaClock, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { horasDisponibles } from "../../../mocks/horaReserva";
import { useAutenticacionStore } from "../../../store/useAutenticacionStore";

const FormularioReserva = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mostrarGuarda, setMostrarGuarda] = useState(false);
  const { usuario } = useAutenticacionStore();

  const handleContinuar = (e) => {
    e.preventDefault();
    if (!usuario) {
      setMostrarGuarda(true);
      return;
    }
    window.location.href = "/usuario/nueva-reservacion";
  };

  return (
    <div className="bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden w-full max-w-md lg:max-w-lg">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-700 rounded-full opacity-30" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-red-700 rounded-full opacity-30" />

      <div className="relative z-10">

        {!mostrarGuarda ? (
          <>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              HAZ TU RESERVA AHORA
            </h3>
            <p className="text-white text-center mb-6 md:mb-8 opacity-90">
              TÚ DECIDES CUÁNDO, NOSOTROS TE ESPERAMOS
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="relative">
                <label className="block text-white font-semibold mb-2">FECHA</label>
                <div className="relative">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white rounded-lg border-none focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-white font-semibold mb-2">
                  SELECCIONE UNA HORA
                </label>
                <div className="relative">
                  <select
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white rounded-lg border-none focus:ring-2 focus:ring-red-400 focus:outline-none appearance-none"
                  >
                    <option value="">Seleccione una hora</option>
                    {horasDisponibles.map((hora, index) => (
                      <option key={index} value={hora.value}>
                        {hora.label}
                      </option>
                    ))}
                  </select>
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-red-700 rounded-lg p-4">
                <div className="flex items-start">
                  <FaInfoCircle className="text-white mt-1 mr-3 shrink-0" />
                  <p className="text-white text-sm">
                    Para realizar una cancelación, comuníquese a través de los datos de contacto indicados en el pie de página.
                  </p>
                </div>
              </div>

              <button
                onClick={handleContinuar}
                className="w-full bg-white text-red-600 font-bold py-3 md:py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continuar</span>
                <FaArrowRight />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setMostrarGuarda(false)}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              ← Volver
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-white/10 border border-white/30 rounded-2xl flex items-center justify-center mb-4">
                <FiLock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                ¡Un paso más!
              </h4>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Para asegurar tu mesa necesitas iniciar sesión o crear una cuenta. ¡Es rápido y gratis!
              </p>
            </div>

            <div className="space-y-4 px-4 mb-8">
              <Link
                to="/inicio-sesion"
                className="group flex items-center gap-3 w-full bg-white text-red-600 hover:bg-gray-50 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-100/50 active:scale-[0.98] border-2 border-transparent hover:border-red-100"
              >
                <FiUser className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Iniciar Sesión</span>
                <FiArrowRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/registro"
                className="group flex items-center gap-3 w-full bg-linear-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-700/30 active:scale-[0.98] border border-white/10 hover:border-white/20"
              >
                <span className="flex-1 text-left">Crear una cuenta</span>
                <FiArrowRight className="w-5 h-5 text-red-100 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="border-t border-white/20 pt-5">
              <p className="text-white/50 text-xs text-center mb-3">
                ¿Prefieres reservar sin cuenta?
              </p>
              <a
                href={`https://wa.me/51938896062?text=${encodeURIComponent("Hola, me gustaría hacer una reservación.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <FaWhatsapp className="w-4 h-4" />
                Reservar por WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormularioReserva;