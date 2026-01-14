import { FiLayers } from "react-icons/fi";
import { Tabla } from "../../ui/tabla/Tabla";
import FilaCategoria from "./FilaCategoria";

const TablaCategorias = ({ 
  categorias, 
  loading,
  onEditar
}) => {
  const encabezados = ["Nombre de Categoría", "Acciones"];

  const registros = categorias.map((categoria) => (
    <FilaCategoria 
      key={categoria.idCategoria}
      categoria={categoria}
      onEditar={onEditar}
    />
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiLayers className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Categorías de Productos
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({categorias.length} categorías)
          </span>
        </div>
      </div>
      {categorias.length > 0 ? (
        <Tabla
          encabezados={encabezados}
          registros={registros}
        />
      ) : (
        <div className="text-center py-12">
          <FiLayers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {loading ? 'Cargando categorías...' : 'No se encontraron categorías'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TablaCategorias;