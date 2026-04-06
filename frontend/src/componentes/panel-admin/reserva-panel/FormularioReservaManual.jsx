import { useState, useEffect, useCallback, useMemo } from "react";
import { FiLoader, FiUsers, FiClock } from "react-icons/fi";
import { useReservacionAdminStore } from "../../../store/useReservacionAdminStore";

const FormularioReservaManual = ({ fechaInicial, onSubmit, onCancelar, guardando }) => {
  const { mesasDisponibles, cargarMesasDisponibles, limpiarMesasDisponibles, cargandoMesas } =
    useReservacionAdminStore();

  const hoyStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const generarOpcionesDeHora = useCallback((fechaSeleccionada) => {
    const opciones = [];
    const ahora = new Date();
    const limiteAnticipacion = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);

    for (let h = 12; h <= 20; h++) {
      [0, 30].forEach((m) => {
        if (h === 20 && m > 0) return;
        const horaTexto = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

        if (fechaSeleccionada === hoyStr) {
          const horaOpcion = new Date();
          horaOpcion.setHours(h, m, 0, 0);
          if (horaOpcion >= limiteAnticipacion) opciones.push(horaTexto);
        } else {
          opciones.push(horaTexto);
        }
      });
    }
    return opciones;
  }, [hoyStr]);

  const [form, setForm] = useState(() => {
    const fechaIniciada = fechaInicial || (new Date().getHours() >= 18
      ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
      : hoyStr);

    const horasDisponibles = generarOpcionesDeHora(fechaIniciada);

    return {
      fecha: fechaIniciada,
      hora: horasDisponibles[0] ?? "12:00",
      correo: '',
      cantidadPersonas: 1,
      mesasSeleccionadas: [],
    };
  });

  const opcionesHora = useMemo(
    () => generarOpcionesDeHora(form.fecha),
    [form.fecha, generarOpcionesDeHora]
  );

  useEffect(() => {
    if (opcionesHora.length > 0 && !opcionesHora.includes(form.hora)) {
      setForm(prev => ({ ...prev, hora: opcionesHora[0] }));
    }
  }, [form.fecha]);

  useEffect(() => {
    if (form.fecha && form.hora) {
      cargarMesasDisponibles(form.fecha, form.hora);
    }
    return () => limpiarMesasDisponibles();
  }, [form.fecha, form.hora]);

  useEffect(() => {
    if (!mesasDisponibles.length) return;
    const idsReservadas = new Set(
      mesasDisponibles
        .filter(m => ['reservada', 'ocupada', 'reserved', 'no disponible'].includes(m.estado?.toLowerCase()))
        .map(m => m.id_mesa)
    );
    const seleccionadasValidas = form.mesasSeleccionadas.filter(id => !idsReservadas.has(id));
    if (seleccionadasValidas.length !== form.mesasSeleccionadas.length) {
      setForm(prev => ({ ...prev, mesasSeleccionadas: seleccionadasValidas }));
    }
  }, [mesasDisponibles]);

  const manejarSubmit = () => {
    onSubmit({
      fecha: form.fecha,
      hora: form.hora,
      correo: form.correo,
      cantidadPersonas: Number(form.cantidadPersonas),
      mesas: form.mesasSeleccionadas.map((id) => ({ idMesa: Number(id) })),
    });
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha de Reserva</label>
          <input
            type="date"
            className={inputClass}
            value={form.fecha}
            min={hoyStr}
            onChange={(e) => setForm(prev => ({ ...prev, fecha: e.target.value, mesasSeleccionadas: [] }))}
          />
        </div>
        <div>
          <label className={labelClass}>Hora</label>
          <div className="relative">
            <select
              className={inputClass}
              value={form.hora}
              onChange={(e) => setForm(prev => ({ ...prev, hora: e.target.value, mesasSeleccionadas: [] }))}
            >
              {opcionesHora.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
              {opcionesHora.length === 0 && <option disabled>No hay horarios disponibles</option>}
            </select>
            <FiClock className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* resto del JSX sin cambios... */}
      <div>
        <label className={labelClass}>Correo del Cliente</label>
        <input
          type="email"
          className={inputClass}
          placeholder="admin@ejemplo.com"
          value={form.correo}
          onChange={(e) => setForm(prev => ({ ...prev, correo: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClass}>Cantidad de Personas</label>
        <input
          type="number"
          className={inputClass}
          min={1}
          value={form.cantidadPersonas}
          onChange={(e) => setForm(prev => ({ ...prev, cantidadPersonas: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClass}>
          Estado de Mesas{" "}
          {form.mesasSeleccionadas.length > 0 && (
            <span className="text-blue-600 font-bold">({form.mesasSeleccionadas.length})</span>
          )}
        </label>

        {cargandoMesas ? (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
            <FiLoader className="animate-spin" /> Sincronizando mapa...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            {mesasDisponibles.map((mesa) => {
              const sel = form.mesasSeleccionadas.includes(mesa.id_mesa);
              const estaReservada = ['reservada', 'ocupada', 'reserved', 'no disponible'].includes(
                mesa.estado?.toLowerCase()
              );

              return (
                <button
                  key={mesa.id_mesa}
                  type="button"
                  disabled={estaReservada}
                  onClick={() => {
                    if (estaReservada) return;
                    setForm(prev => ({
                      ...prev,
                      mesasSeleccionadas: sel
                        ? prev.mesasSeleccionadas.filter(id => id !== mesa.id_mesa)
                        : [...prev.mesasSeleccionadas, mesa.id_mesa]
                    }));
                  }}
                  className={`p-2 rounded-lg border text-sm transition-all relative flex flex-col items-center justify-center min-h-[60px] outline-none focus:outline-none ${estaReservada
                    ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60 pointer-events-none'
                    : sel
                      ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-md scale-[1.02]'
                      : 'border-gray-200 text-gray-700 bg-white hover:border-blue-400 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {estaReservada && (
                    <span className="absolute top-1 right-1 text-[7px] bg-red-500 text-white px-1 rounded-sm font-black uppercase">
                      Reservada
                    </span>
                  )}
                  <div className={estaReservada ? "line-through text-xs" : "text-sm"}>
                    Mesa {mesa.numero_mesa}
                  </div>
                  <div className={`text-[10px] flex items-center gap-1 ${sel ? 'text-blue-100' : 'text-gray-400'}`}>
                    <FiUsers size={10} /> Cap: {mesa.capacidad_mesa || mesa.capacidad}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg outline-none focus:outline-none"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={manejarSubmit}
          disabled={guardando || form.mesasSeleccionadas.length === 0}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform outline-none focus:outline-none"
        >
          {guardando ? <FiLoader className="animate-spin" /> : "Confirmar Reserva Manual"}
        </button>
      </div>
    </div>
  );
};

export default FormularioReservaManual;