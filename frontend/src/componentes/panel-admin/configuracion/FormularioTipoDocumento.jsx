import { useEffect, useState } from "react";

const FormularioTipoDocumento = ({ tipoDocumento = null, onSubmit, onCancelar, cargando }) => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    setNombre(tipoDocumento?.nombre_tipo_documento ?? "");
  }, [tipoDocumento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onSubmit({ nombreDocumento: nombre.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Nombre del tipo de documento
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: DNI, RUC, Pasaporte..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          autoFocus
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando || !nombre.trim()}
          className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          {cargando ? "Guardando..." : tipoDocumento ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default FormularioTipoDocumento;