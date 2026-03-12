import { FormProvider, useForm } from "react-hook-form";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useReservacionStore } from "../../store/useReservacionStore";
import PasosNavegacion from "../../componentes/PasosNavegacion";
import Paso1DatosBasicos from "../../componentes/Paso1DatosBasicos";
import Paso2SeleccionMesas from "../../componentes/Paso2SeleccionMesas";
import Paso3Confirmacion from "../../componentes/Paso3Confirmacion";

const NuevaReservacion = () => {
  const store = useReservacionStore();
  const { 
    pasoActual, 
    setPaso, 
    datos, 
    updateDatos,
    resetReserva
  } = store;

  const methods = useForm({
    defaultValues: {
      fecha: datos.fecha || '',
      hora: datos.hora || '',
      personas: datos.personas || 2,
    },
    mode: "onChange"
  });

  const { formState: { isValid }, getValues } = methods;

  const handleAvanzarPaso1 = () => {
    const data = getValues();
    updateDatos(data);
    setPaso(2);
  };

  const valores = getValues();

  const verificarPaso2 = () => {
    if (!datos.mesas || datos.mesas.length === 0) {
      return false;
    }
    
    const capacidadTotal = datos.mesas.reduce((total, mesa) => total + mesa.capacidad, 0);
    return capacidadTotal >= datos.personas;
  };

  const handleAvanzarPaso2 = () => {
    if (verificarPaso2()) {
      setPaso(3);
    }
  };

  const puedeAvanzarDesdeP1 = valores.fecha && valores.hora && valores.personas >= 2;

  const puedeAvanzarDesdeP2 = verificarPaso2();

  const capacidadActual = datos.mesas?.reduce((total, mesa) => total + mesa.capacidad, 0) || 0;

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            NUEVA <span className="text-red-600">RESERVACIÓN</span>
          </h1>
          <div className="w-24 md:w-32 h-1 bg-red-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-gray-400 text-sm md:text-base">
            Completa los pasos para realizar tu reserva
          </p>
        </header>

        <PasosNavegacion />

        <div className="bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-700 p-4 md:p-8">
          
          {pasoActual === 1 && (
            <FormProvider {...methods}>
              <div>
                <Paso1DatosBasicos />
              </div>
            </FormProvider>
          )}
          
          {pasoActual === 2 && <Paso2SeleccionMesas />}
          
          {pasoActual === 3 && <Paso3Confirmacion />}
        </div>

        {pasoActual !== 3 && (
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 md:mt-8">
            <button
              type="button"
              onClick={() => setPaso(pasoActual - 1)}
              disabled={pasoActual === 1}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                pasoActual === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700 text-white hover:scale-105 cursor-pointer"
              }`}
            >
              <FiArrowLeft className="w-5 h-5" />
              Anterior
            </button>

            {pasoActual === 1 ? (
              <button
                type="button"
                onClick={handleAvanzarPaso1}
                disabled={!puedeAvanzarDesdeP1}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  !puedeAvanzarDesdeP1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white hover:scale-105 cursor-pointer"
                }`}
              >
                Siguiente
                <FiArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAvanzarPaso2}
                disabled={!puedeAvanzarDesdeP2}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  !puedeAvanzarDesdeP2
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white hover:scale-105 cursor-pointer"
                }`}
              >
                Continuar a Confirmación
                <FiArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {pasoActual === 3 && (
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 md:mt-8">
            <button
              type="button"
              onClick={() => setPaso(2)}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <FiArrowLeft className="w-5 h-5" />
              Volver a Mesas
            </button>

            <button
              type="button"
              onClick={() => {
                resetReserva();
                methods.reset({
                  fecha: '',
                  hora: '',
                  personas: 2,
                });
              }}
              className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Nueva Reservación
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {pasoActual === 2 && !puedeAvanzarDesdeP2 && datos.mesas?.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-xl text-center">
            <p className="text-yellow-400 text-sm">
              ⚠️ La capacidad de las mesas seleccionadas ({capacidadActual} personas) 
              es insuficiente para {datos.personas} personas. Selecciona más mesas.
            </p>
          </div>
        )}

        {pasoActual === 2 && datos.mesas?.length === 0 && (
          <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl text-center">
            <p className="text-blue-400 text-sm">
              Selecciona al menos una mesa para continuar con tu reserva
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold">i</span>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1 text-sm md:text-base">
                Información importante
              </h4>
              <ul className="text-gray-400 text-xs md:text-sm space-y-1">
                <li>• Cada mesa tiene un costo de S/ 15.00</li>
                <li>• Se requiere un anticipo del 50% para confirmar la reserva</li>
                <li>• El saldo restante se paga en el restaurante</li>
                <li>• Las reservas para hoy requieren mínimo 2 horas de anticipación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NuevaReservacion;
