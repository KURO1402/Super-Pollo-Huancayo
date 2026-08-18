import { useEffect, useRef, useState } from "react";

const URL_APK = `${import.meta.env.VITE_BACKEND_URL}/api/descargas/super_pollo.apk`;
const VERSION_APP = "1.0.1";

const DesplegableDescargaApp = () => {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const contenedorRef = useRef(null);

  const alternarDesplegable = () => setEstaAbierto((prev) => !prev);
  const cerrarDesplegable = () => setEstaAbierto(false);

  useEffect(() => {
    const manejarClicFuera = (evento) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(evento.target)
      ) {
        cerrarDesplegable();
      }
    };

    document.addEventListener("mousedown", manejarClicFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClicFuera);
    };
  }, []);

  return (
    <div className="relative" ref={contenedorRef}>
      <button
        onClick={alternarDesplegable}
        className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 lg:h-11 lg:w-11 lg:border"
        aria-label="Descargar aplicación móvil"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M11 18H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {estaAbierto && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 18H13"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Super Pollo App
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Versión {VERSION_APP} · Android
              </p>
            </div>
          </div>
          <a
            href={URL_APK}
            download
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Descargar APK
          </a>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 leading-relaxed">
            Si es tu primera instalación, activa "Instalar apps desconocidas"
            en tu celular cuando el sistema lo solicite.
          </p>
        </div>
      )}
    </div>
  );
};

export default DesplegableDescargaApp;