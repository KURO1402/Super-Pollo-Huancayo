import { useState } from 'react';
import { FiFileText, FiCalendar, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";
import { SiMercadopago } from "react-icons/si";
import { MdTableBar } from "react-icons/md";
import { useReservacionStore } from "../store/useReservacionStore";
import { useAutenticacionStore } from '../store/useAutenticacionStore';

const Paso3Confirmacion = () => {

  const { datos, resetReserva, crearReserva } = useReservacionStore();
  const { usuario } = useAutenticacionStore();

  const [procesandoPago, setProcesandoPago] = useState(false);

  const COSTO_POR_MESA = 10;
  const costoMesas = (datos.mesas?.length || 0) * COSTO_POR_MESA;
  const saldoPendiente = costoMesas - costoMesas;

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const formatearMoneda = (monto) => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const handleIniciarPago = async () => {

    if (!datos.mesas?.length) return;

    setProcesandoPago(true);

    try {

      const respuesta = await crearReserva();

      if (respuesta?.sandbox_init_point) {

        window.open(respuesta.sandbox_init_point, "_blank");

      } else {
        alert("No se pudo generar el enlace de pago.");
      }

    } catch (error) {
      console.error(error);
      alert(error.message || "Error al crear la reserva");
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleCancelarReserva = () => {
    if (window.confirm("¿Estás seguro de cancelar la reservación?")) {
      resetReserva();
    }
  };

  const puedeProcesarPago = datos.mesas?.length > 0 && !procesandoPago;

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto px-4 md:px-0">

      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Confirmar Reservación
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          Revisa los detalles y realiza el pago del costoMesas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">

          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <FiFileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Resumen de Reserva
            </h3>
          </div>

          <div className="space-y-3 md:space-y-4">

            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-500" />
              <div>
                <span className="text-gray-400 text-xs md:text-sm">Fecha:</span>
                <p className="font-semibold text-white">
                  {formatearFecha(datos.fecha)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-500" />
              <div>
                <span className="text-gray-400 text-xs md:text-sm">Hora:</span>
                <p className="font-semibold text-white">
                  {datos.hora || "No especificada"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiUsers className="w-5 h-5 text-yellow-500" />
              <div>
                <span className="text-gray-400 text-xs md:text-sm">Personas:</span>
                <p className="font-semibold text-white">
                  {datos.personas} personas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <MdTableBar className="w-5 h-5 text-red-500 mt-1" />
              <div className="flex-1">
                <span className="text-gray-400 text-xs md:text-sm">
                  Mesas Seleccionadas:
                </span>

                {datos.mesas?.length > 0 ? (
                  <div className="mt-2 space-y-2">

                    {datos.mesas.map((mesa) => (
                      <div
                        key={mesa.id}
                        className="flex justify-between bg-gray-600 rounded-lg px-3 py-2"
                      >

                        <span className="text-white">
                          Mesa {mesa.numero}
                        </span>

                        <span className="text-gray-300 text-sm">
                          {mesa.capacidad} personas
                        </span>

                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    No hay mesas seleccionadas
                  </p>
                )}

              </div>
            </div>

          </div>

        </div>

        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">

          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600/10 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Pago las Mesas
            </h3>
          </div>

          <div className="space-y-4 mb-6">

            <div className="flex justify-between bg-gray-700 p-3 rounded-lg">
              <span className="text-gray-400">Mesas reservadas</span>
              <span className="text-white">{datos.mesas?.length || 0}</span>
            </div>

            <div className="flex justify-between bg-gray-700 p-3 rounded-lg">
              <span className="text-gray-400">Costo por mesa</span>
              <span className="text-white">
                {formatearMoneda(COSTO_POR_MESA)}
              </span>
            </div>

            <div className="flex justify-between bg-blue-600/10 border border-blue-500/20 p-3 rounded-lg">
              <span className="text-gray-400">Costo total</span>
              <span className="text-white font-bold">
                {formatearMoneda(costoMesas)}
              </span>
            </div>

          </div>

          <button
            onClick={handleIniciarPago}
            disabled={!puedeProcesarPago}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <SiMercadopago className="text-4xl text-blue-950" />

            {procesandoPago
              ? "Redirigiendo a MercadoPago..."
              : "Pagar con Mercado Pago"}
          </button>

          <button
            onClick={handleCancelarReserva}
            disabled={procesandoPago}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold border border-gray-500"
          >
            Cancelar Reservación
          </button>

        </div>

      </div>
    </div>
  );
};

export default Paso3Confirmacion;