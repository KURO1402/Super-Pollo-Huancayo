import { FiEdit2, FiTrash2, FiGrid } from "react-icons/fi";

const getGradientByIndex = (id) => {
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
  ];
  const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const getInitials = (nombre) => {
  return nombre
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const GridCategorias = ({ categorias, cargando, onEditar, onEliminar }) => {
  if (cargando) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!categorias.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
            <FiGrid size={48} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
            +
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No hay categorías
        </h3>
        <p className="text-base text-gray-400 dark:text-gray-500 text-center max-w-sm">
          Agrega tu primera categoría para organizar tus productos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categorias.map((categoria) => {
        const gradient = getGradientByIndex(categoria.id_categoria);
        const initials = getInitials(categoria.nombre_categoria);

        return (
          <div
            key={categoria.id_categoria}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30 transition-all duration-300"
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${gradient} rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity`} />

            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`relative shrink-0 w-16 h-16 rounded-xl bg-linear-to-br ${gradient} shadow-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {initials}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
                    <FiGrid size={12} className="text-gray-600 dark:text-gray-300" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize leading-tight truncate">
                    {categoria.nombre_categoria}
                  </h4>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Categoría de producto
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-gray-100 dark:border-gray-700/50" />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEditar(categoria)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-xl transition-all duration-200 group/edit border border-gray-200 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-800"
                >
                  <FiEdit2 size={18} className="group-hover/edit:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Editar</span>
                </button>

                <button
                  onClick={() => onEliminar(categoria)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 group/delete border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
                >
                  <FiTrash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridCategorias;