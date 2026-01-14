import { useState } from "react";
import { FaCalendarAlt, FaClock, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { horasDisponibles } from "../../../mocks/horaReserva";

const FormularioReserva = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  return (
    <div className="bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden w-full max-w-md lg:max-w-lg">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-700 rounded-full opacity-30"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-red-700 rounded-full opacity-30"></div>

      <div className="relative z-10">
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
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
              <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-red-700 rounded-lg p-4">
            <div className="flex items-start">
              <FaInfoCircle className="text-white mt-1 mr-3 flex-shrink-0" />
              <p className="text-white text-sm">
                Para realizar una cancelación, comuníquese a través de los datos de contacto indicados en el pie de página.
              </p>
            </div>
          </div>

          <Link 
            to="/registro"
            className="w-full bg-white text-red-600 font-bold py-3 md:py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span>Continuar</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormularioReserva;