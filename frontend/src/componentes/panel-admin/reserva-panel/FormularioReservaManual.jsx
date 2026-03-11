import { useState, useEffect } from "react";
import { FiLoader, FiUsers } from "react-icons/fi";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";

const FormularioReservaManual = ({ fechaInicial, onSubmit, onCancelar, guardando }) => {
  const { mesasDisponibles, cargandoMesas, cargarMesasDisponibles, limpiarMesasDisponibles } =
    useReservacionAdminStore();

  const [form, setForm] = useState({
    fecha: fechaInicial || new Date().toISOString().split('T')[0],
    hora: '12:00',
    correo: '',
    cantidadPersonas: 1,
    mesasSeleccionadas: [],  
  });

  useEffect(() => {
    if (form.fecha && form.hora) {
      cargarMesasDisponibles(form.fecha, form.hora);
    }
    return () => limpiarMesasDisponibles();
  }, [form.fecha, form.hora]);

  const actualizarCampo = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const toggleMesa = (idMesa) => {
    setForm((prev) => {
      const yaSeleccionada = prev.mesasSeleccionadas.includes(idMesa);
      return {
        ...prev,
        mesasSeleccionadas: yaSeleccionada
          ? prev.mesasSeleccionadas.filter(id => id !== idMesa)
          : [...prev.mesasSeleccionadas, idMesa],
      };
    });
  };

  const manejarSubmit = () => {
    const payload = {
      fecha: form.fecha,
      hora: form.hora,
      correo: form.correo,
      cantidadPersonas: Number(form.cantidadPersonas),
      mesas: form.mesasSeleccionadas.map(id => ({ idMesa: id })),
    };
    onSubmit(payload);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            className={inputClass}
            value={form.fecha}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => actualizarCampo('fecha', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Hora</label>
          <input
            type="time"
            className={inputClass}
            value={form.hora}
            onChange={(e) => actualizarCampo('hora', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Correo del cliente</label>
        <input
          type="email"
          className={inputClass}
          placeholder="cliente@correo.com"
          value={form.correo}
          onChange={(e) => actualizarCampo('correo', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Cantidad de personas</label>
        <input
          type="number"
          className={inputClass}
          min={1}
          value={form.cantidadPersonas}
          onChange={(e) => actualizarCampo('cantidadPersonas', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          Mesas disponibles
          {form.mesasSeleccionadas.length > 0 && (
            <span className="ml-2 text-blue-600 font-normal">
              ({form.mesasSeleccionadas.length} seleccionada{form.mesasSeleccionadas.length > 1 ? 's' : ''})
            </span>
          )}
        </label>

        {cargandoMesas ? (
          <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
            <FiLoader className="animate-spin w-4 h-4" />
            Buscando mesas disponibles...
          </div>
        ) : mesasDisponibles.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">
            No hay mesas disponibles para esta fecha y hora.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {mesasDisponibles.map((mesa) => {
              const seleccionada = form.mesasSeleccionadas.includes(mesa.id_mesa);
              return (
                <button
                  key={mesa.id_mesa}
                  type="button"
                  onClick={() => toggleMesa(mesa.id_mesa)}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    seleccionada
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-semibold">Mesa {mesa.numero_mesa}</div>
                  <div className="flex items-center justify-center gap-1 text-[11px] opacity-70 mt-0.5">
                    <FiUsers className="w-3 h-3" />
                    {mesa.capacidad} personas
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={manejarSubmit}
          disabled={guardando || form.mesasSeleccionadas.length === 0}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm flex items-center gap-2"
        >
          {guardando
            ? <><FiLoader className="animate-spin" /> Guardando...</>
            : "Crear Reserva"
          }
        </button>
      </div>
    </div>
  );
};

export default FormularioReservaManual;