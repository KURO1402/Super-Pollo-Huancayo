import { useEffect } from "react";
import { FiX } from "react-icons/fi";
const tamaños = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
};

const Modal = ({
  estaAbierto,
  onCerrar,
  titulo,
  children,
  tamaño,
  mostrarHeader,
  mostrarFooter,
  accionesFooter,
}) => {
  useEffect(() => {
    if (!estaAbierto) return;

    const manejarTeclaESC = (e) => e.key === "Escape" && onCerrar(); 
    document.addEventListener("keydown", manejarTeclaESC);

    return () => {
      document.removeEventListener("keydown", manejarTeclaESC);
      
    };
  }, [estaAbierto, onCerrar]);

  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCerrar} />
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${tamaños[tamaño]} max-h-[90vh] flex flex-col z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {mostrarHeader && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {titulo}
            </h2>
            <button
              onClick={onCerrar}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <FiX size={24} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {mostrarFooter && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            {accionesFooter ?? (
              <>
                <button
                  onClick={onCerrar}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onCerrar}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Confirmar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;