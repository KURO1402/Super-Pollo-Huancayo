import { useState } from 'react';
import { FiFileText, FiCalendar, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";
import { MdTableBar } from "react-icons/md";
import { useReservacionStore } from "../store/useReservacionStore";
import { useAutenticacionStore } from '../store/useAutenticacionStore';
import { registrarReservacionServicio } from '../servicios/reservacionesServicio';
import { generarPreferenciaMercadoPago } from '../servicios/reservacionesServicio';

import MercadoPagoButton from './ui/botones/MercadoPagoButton';

const Paso3Confirmacion = () => {
  const { datos, resetReserva } = useReservacionStore();
  const { usuario } = useAutenticacionStore();
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [reservationId, setReservationId] = useState(null);

  // Calcular costos
  const COSTO_POR_MESA = 15;
  const costoMesas = (datos.mesas?.length || 0) * COSTO_POR_MESA;
  const anticipo = costoMesas * 0.5; // 50% del total de mesas
  const saldoPendiente = costoMesas - anticipo;

  const prepararReservaYPreferencia = async () => {
    if (preferenceId) return preferenceId;

    setProcesandoPago(true);
    try {
      // Preparar datos de las mesas seleccionadas
      const mesasIds = datos.mesas.map(mesa => mesa.id);
      
      const reservaData = {
        fechaReservacion: datos.fecha,
        horaReservacion: datos.hora + ':00',
        cantidadPersonas: datos.personas,
        idUsuario: usuario.idUsuario,
        mesas: mesasIds, // Array de IDs de mesas
        costoTotal: costoMesas,
        anticipo: anticipo
      };

      const reservaCreada = await registrarReservacionServicio(reservaData);
      
      setReservationId(reservaCreada.idReservacion);
      const preferencia = await generarPreferenciaMercadoPago(reservaCreada.idReservacion);
      setPreferenceId(preferencia.preference_id);
    
      return preferencia.preference_id;

    } catch (error) {
      mostrarAlerta.error("Error al preparar la reserva. Intenta nuevamente.");
      throw error;
    } finally {
      setProcesandoPago(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setProcesandoPago(true);
    try {
      resetReserva();
      mostrarAlerta.exito("Reserva realizada de manera exitosa");
    } catch (error) {
      alert("Error al guardar la reserva. Contacta con soporte.");
    } finally {
      setProcesandoPago(false);
    }
  };

  const handlePaymentError = (error) => {
    alert("Error en el proceso de pago. Intenta nuevamente.");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const formatearMoneda = (monto) => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const handleIniciarPago = async () => {
    try {
      await prepararReservaYPreferencia();
    } catch (error) {
      console.error('Error al iniciar pago:', error);
    }
  };

  const handleCancelarReserva = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reservación? Se perderán todos los datos.")) {
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
          Revisa los detalles y realiza el pago del anticipo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* RESUMEN DE RESERVA */}
        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <FiFileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">Resumen de Reserva</h3>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-400 text-xs md:text-sm">Fecha:</span>
                <p className="font-semibold text-white text-sm md:text-base truncate">
                  {formatearFecha(datos.fecha)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-400 text-xs md:text-sm">Hora:</span>
                <p className="font-semibold text-white text-sm md:text-base">
                  {datos.hora || "No especificada"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiUsers className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-400 text-xs md:text-sm">Personas:</span>
                <p className="font-semibold text-white text-sm md:text-base">
                  {datos.personas} {datos.personas === 1 ? 'persona' : 'personas'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <MdTableBar className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-400 text-xs md:text-sm">Mesas Seleccionadas:</span>
                {datos.mesas?.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {datos.mesas.map((mesa) => (
                      <div 
                        key={mesa.id}
                        className="flex items-center justify-between bg-gray-600 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <MdTableBar className="w-4 h-4 text-red-400" />
                          <span className="text-white text-sm font-medium">
                            Mesa {mesa.numero}
                          </span>
                          <span className="text-gray-400 text-xs">
                            (Piso {mesa.piso})
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">
                          {mesa.capacidad} personas
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">No hay mesas seleccionadas</p>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <div className="flex items-start gap-2">
              <FiMapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-semibold text-sm mb-1">Ubicación</h4>
                <p className="text-gray-300 text-xs">
                  {datos.mesas?.[0]?.piso === 1 ? 'Primer Piso' : 'Segundo Piso'} del restaurante
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PAGO DEL ANTICIPO */}
        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600/10 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">Pago del Anticipo</h3>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6">
            {/* Detalle de mesas */}
            <div className="p-3 md:p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Mesas reservadas:</span>
                <span className="text-white font-semibold">{datos.mesas?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Costo por mesa:</span>
                <span className="text-white font-semibold">{formatearMoneda(COSTO_POR_MESA)}</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-blue-600/5 rounded-xl border border-blue-500/20">
              <span className="text-gray-400 text-sm md:text-base">Costo Total:</span>
              <span className="font-bold text-white text-base md:text-lg">
                {formatearMoneda(costoMesas)}
              </span>
            </div>
            
            {/* Anticipo */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-yellow-600/10 rounded-xl border border-yellow-500/20">
              <div>
                <span className="text-gray-400 text-sm md:text-base">Anticipo:</span>
                <p className="text-xs text-gray-500">(50% del total)</p>
              </div>
              <span className="font-bold text-yellow-500 text-base md:text-lg">
                {formatearMoneda(anticipo)}
              </span>
            </div>
            
            {/* Total a pagar */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-red-600/10 rounded-xl border-2 border-red-500">
              <span className="text-white font-bold text-base md:text-lg">Total a Pagar Ahora:</span>
              <span className="font-bold text-red-500 text-lg md:text-xl">
                {formatearMoneda(anticipo)}
              </span>
            </div>

            {/* Saldo pendiente */}
            <div className="text-center p-3 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">
                Saldo pendiente: <span className="text-white font-semibold">
                  {formatearMoneda(saldoPendiente)}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Se pagará en el restaurante)
              </p>
            </div>
          </div>

          {/* Botones de pago */}
          {!preferenceId ? (
            <button 
              onClick={handleIniciarPago}
              disabled={!puedeProcesarPago || procesandoPago}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {procesandoPago ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Preparando pago...
                </>
              ) : (
                "Preparar Pago"
              )}
            </button>
          ) : (
            <div className="mb-4">
              <MercadoPagoButton 
                monto={anticipo}
                datosReserva={datos}
                preferenceId={preferenceId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                disabled={!puedeProcesarPago}
              />
            </div>
          )}

          {procesandoPago && (
            <div className="text-center py-2">
              <p className="text-blue-500 text-sm">Procesando reserva...</p>
            </div>
          )}

          <button 
            onClick={handleCancelarReserva}
            disabled={procesandoPago}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {procesandoPago ? "Procesando..." : "Cancelar Reservación"}
          </button>

          {/* Nota importante */}
          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              <strong>Importante:</strong> Al pagar el anticipo, confirmas tu reservación. 
              El saldo restante se pagará en el restaurante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paso3Confirmacion;