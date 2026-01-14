import { FiCalendar, FiClock, FiUsers, FiBox, FiSave, FiX, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import { obtenerReservacionPorIdServicio } from "../../../servicios/reservacionesServicio";
import { actualizarReservacionServicio } from "../../../servicios/reservacionesServicio";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

export const ModalEditarReserva = ({ idReservacion, onClose, onGuardar }) => {
  const [reserva, setReserva] = useState(null);
  const [formData, setFormData] = useState({
    fechaReservacion: '',
    horaReservacion: '',
    cantidadPersonas: '',
    idMesa: '',
    estadoReservacion: 'pendiente'
  });

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (idReservacion) {
      cargarReserva();
    }
  }, [idReservacion]);

  const cargarReserva = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerReservacionPorIdServicio(idReservacion);

      if (respuesta.ok && Array.isArray(respuesta.reservacion) && respuesta.reservacion.length > 0) {
        const reservaData = respuesta.reservacion[0];

        setReserva(reservaData);
        
        setFormData({
          idReservacion: reservaData.idReservacion,
          fechaReservacion: reservaData.fechaReservacion
          ? reservaData.fechaReservacion.split("T")[0]
          : "",
          horaReservacion: reservaData.horaReservacion.substring(0, 5),
          cantidadPersonas: reservaData.cantidadPersonas.toString(),
          idMesa: reservaData.idMesa.toString(),
          estadoReservacion: reservaData.estadoReservacion,
        });
      }
    } catch (error) {
      mostrarAlerta.error("Error al cargar los datos de la reserva");
      onClose();
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fechaReservacion || !formData.horaReservacion || !formData.cantidadPersonas || !formData.idMesa) {
      mostrarAlerta.error('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (parseInt(formData.cantidadPersonas) < 1) {
      mostrarAlerta.error('La cantidad de personas debe ser al menos 1');
      return;
    }

    if (parseInt(formData.idMesa) < 1) {
      mostrarAlerta.error('El ID de mesa debe ser válido');
      return;
    }

    const fechaReservacion = new Date(formData.fechaReservacion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaReservacion < hoy) {
      mostrarAlerta.error("No se pueden crear reservas para fechas anteriores a hoy");
      return;
    }

    try {
      setGuardando(true);

      const datosActualizados = {
        fechaReservacion: formData.fechaReservacion,
        horaReservacion: formData.horaReservacion + ':00',
        cantidadPersonas: parseInt(formData.cantidadPersonas),
        idUsuario: reserva.idUsuario,
        idMesa: parseInt(formData.idMesa),
        estadoReservacion: formData.estadoReservacion
      };

      const respuesta = await actualizarReservacionServicio(idReservacion, datosActualizados);
      
      if (respuesta.ok) {
        mostrarAlerta.exito("Reserva actualizada exitosamente");
        if (onGuardar) {
          onGuardar({ ...datosActualizados, idReservacion });
        }
        onClose();
      } else {
        throw new Error(respuesta.mensaje || "Error al actualizar reservación");
      }

    } catch (error) {
      mostrarAlerta.error("Error al guardar la reserva");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos de la reserva...</p>
        </div>
      </div>
    );
  }

  if (!reserva) return null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiCalendar size={16} className="text-blue-600 dark:text-blue-400" />
                Fecha de Reserva
              </div>
            </label>
            <input
              type="date"
              name="fechaReservacion"
              value={formData.fechaReservacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiClock size={16} className="text-blue-600 dark:text-blue-400" />
                Hora de Reserva
              </div>
            </label>
            <input
              type="time"
              name="horaReservacion"
              value={formData.horaReservacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Cantidad de Personas y ID Mesa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiUsers size={16} className="text-green-600 dark:text-green-400" />
                Cantidad de Personas
              </div>
            </label>
            <input
              type="number"
              name="cantidadPersonas"
              value={formData.cantidadPersonas}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiBox size={16} className="text-amber-600 dark:text-amber-400" />
                ID Mesa
              </div>
            </label>
            <input
              type="number"
              name="idMesa"
              value={formData.idMesa}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Estado de la Reserva */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado de la Reserva
          </label>
          <select
            name="estadoReservacion"
            value={formData.estadoReservacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex-1 justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Guardando...
              </>
            ) : (
              <>
                <FiSave size={16} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};