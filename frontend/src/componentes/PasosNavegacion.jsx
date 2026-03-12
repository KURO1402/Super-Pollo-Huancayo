import { FiCheck } from "react-icons/fi";
import { useAutenticacionStore } from "../store/useAutenticacionStore";

const PasosNavegacion = () => {
  const { pasoActual } = useAutenticacionStore();

  const pasos = [
    { numero: 1, nombre: "Datos Básicos" },
    { numero: 2, nombre: "Selección de Mesas" },
    { numero: 3, nombre: "Confirmación" }
  ];

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-4 md:p-6 mb-6 md:mb-8">
      <div className="hidden md:block">
        <div className="flex justify-between items-center">
          {pasos.map((paso, index) => (
            <div key={paso.numero} className="flex items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                  paso.numero === pasoActual
                    ? "bg-red-600 border-red-600 text-white"
                    : paso.numero < pasoActual
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-400"
                }`}
              >
                {paso.numero < pasoActual ? <FiCheck className="w-6 h-6" /> : paso.numero}
              </div>
              {index < pasos.length - 1 && (
                <div 
                  className={`w-24 h-1 mx-4 ${
                    paso.numero < pasoActual ? "bg-green-500" : "bg-gray-700"
                  }`} 
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm font-medium">
          {pasos.map((paso) => (
            <span 
              key={paso.numero}
              className={`text-center ${
                paso.numero === pasoActual 
                  ? "text-red-600" 
                  : paso.numero < pasoActual 
                  ? "text-green-500" 
                  : "text-gray-500"
              }`}
            >
              {paso.nombre}
            </span>
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex flex-col space-y-4">
          {pasos.map((paso, index) => (
            <div key={paso.numero} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all shrink-0 ${
                  paso.numero === pasoActual
                    ? "bg-red-600 border-red-600 text-white"
                    : paso.numero < pasoActual
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-400"
                }`}
              >
                {paso.numero < pasoActual ? <FiCheck className="w-5 h-5" /> : paso.numero}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <span 
                    className={`font-medium ${
                      paso.numero === pasoActual 
                        ? "text-red-600" 
                        : paso.numero < pasoActual 
                        ? "text-green-500" 
                        : "text-gray-500"
                    }`}
                  >
                    Paso {paso.numero}
                  </span>
                  {index < pasos.length - 1 && (
                    <div 
                      className={`h-1 flex-1 mx-4 ${
                        paso.numero < pasoActual ? "bg-green-500" : "bg-gray-700"
                      }`} 
                    />
                  )}
                </div>
                <p 
                  className={`text-sm mt-1 ${
                    paso.numero === pasoActual 
                      ? "text-white font-semibold" 
                      : "text-gray-400"
                  }`}
                >
                  {paso.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Progreso:</span>
          <span className="text-white font-medium">
            Paso {pasoActual} de {pasos.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((pasoActual - 1) / (pasos.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PasosNavegacion;