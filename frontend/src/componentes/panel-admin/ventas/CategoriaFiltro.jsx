export const CategoriaFiltro = ({ categorias, activa, onChange }) => ( 
  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
    {categorias.map((categoria) => (
      <button
        key={categoria}
        onClick={() => onChange(categoria)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          activa === categoria
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      > 
        {categoria} 
      </button> 
    ))}
  </div>
);