import { useState } from "react";
import { FiPlus, FiTrash2, FiLoader } from "react-icons/fi";

const FormularioReservaManual = ({ fechaInicial, onSubmit, onCancelar, guardando }) => {
  const [form, setForm] = useState({
    fecha: fechaInicial || new Date().toISOString().split('T')[0],
    hora: '12:00',
    correo: '',
    cantidadPersonas: 1,
    mesas: [{ idMesa: '' }],
  });

  const actualizarCampo = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const actualizarMesa = (index, valor) => {
    const nuevasMesas = [...form.mesas];
    nuevasMesas[index] = { idMesa: valor === '' ? '' : Number(valor) };
    setForm((prev) => ({ ...prev, mesas: nuevasMesas }));
  };

  const agregarMesa = () =>
    setForm((prev) => ({ ...prev, mesas: [...prev.mesas, { idMesa: '' }] }));

  const eliminarMesa = (index) =>
    setForm((prev) => ({ ...prev, mesas: prev.mesas.filter((_, i) => i !== index) }));

  const manejarSubmit = () => {
    const payload = {
      ...form,
      cantidadPersonas: Number(form.cantidadPersonas),
      mesas: form.mesas.filter(m => m.idMesa !== ''),
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
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass.replace('mb-1', '')}>Mesas</label>
          <button
            type="button"
            onClick={agregarMesa}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <FiPlus /> Agregar mesa
          </button>
        </div>

        <div className="space-y-2">
          {form.mesas.map((mesa, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="number"
                className={inputClass}
                placeholder={`ID Mesa ${index + 1}`}
                min={1}
                value={mesa.idMesa}
                onChange={(e) => actualizarMesa(index, e.target.value)}
              />
              {form.mesas.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarMesa(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
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
          disabled={guardando}
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