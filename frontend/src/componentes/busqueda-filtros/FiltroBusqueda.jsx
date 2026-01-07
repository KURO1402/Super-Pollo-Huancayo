import { FiFilter } from "react-icons/fi";

export const FiltroBusqueda = ({ valor, onChange, opciones }) => {
  return (
    <div className="flex items-center gap-2 mr-0">
      <FiFilter className="text-gray-400" />
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </div>
  );
};
