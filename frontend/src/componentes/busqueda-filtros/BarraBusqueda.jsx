import { FiSearch } from "react-icons/fi";

export const BarraBusqueda = ({ valor, onChange, placeholder }) => { 
  return (
    <div className="flex-1 relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
      <input 
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-blue-700"
      />
    </div>
  );
};
