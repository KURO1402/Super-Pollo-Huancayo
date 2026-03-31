import { FaClock, FaInfoCircle, FaHome, FaWhatsapp, FaHourglassHalf, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PagoPendiente = () => {
  return (
    <section className="bg-azul-secundario relative w-full min-h-screen py-20 md:py-24 lg:py-32 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #f4b942 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="relative opacity-0 animate-fade-up">
          <div className="absolute -inset-3 border border-rojo/20 rounded-2xl z-0 hidden md:block" />
          <div className="absolute -inset-6 border border-amarillo/10 rounded-3xl z-0 hidden md:block" />
          
          <div className="relative bg-gray-900/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-10 ring-1 ring-white/10">
            
            <div className="h-2 bg-linear-to-r from-rojo via-amarillo to-rojo" />
            
            <div className="p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl mx-auto text-center">
                
                <div className="flex justify-center mb-8 opacity-0 animate-fade-up delay-200">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-linear-to-br from-yellow-500 to-yellow-600 p-5 rounded-full shadow-lg">
                      <FaHourglassHalf className="text-white text-5xl" />
                    </div>
                  </div>
                </div>

                <div className="mb-8 opacity-0 animate-fade-up delay-300">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="block w-8 h-px bg-amarillo" />
                    <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">
                      TRANSACCIÓN EN PROCESO
                    </span>
                    <span className="block w-8 h-px bg-amarillo" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    PAGO{" "}
                    <span className="text-yellow-400 relative inline-block">
                      PENDIENTE
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 rounded-full opacity-50" />
                    </span>
                  </h1>
                  <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
                </div>

                <p className="text-gray-300 text-lg mb-4 opacity-0 animate-fade-up delay-400">
                  Estamos procesando tu pago
                </p>
                <p className="text-gray-400 mb-10 opacity-0 animate-fade-up delay-500">
                  Te notificaremos cuando se complete la transacción. No cierres esta ventana.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 opacity-0 animate-fade-up delay-600">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-yellow-500 to-yellow-300 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-300" />
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
                          <FaRegClock className="text-yellow-400 text-2xl" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">ESTADO</h3>
                        <p className="text-gray-400 text-sm">Pendiente de confirmación</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-blue-300 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-300" />
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                          <FaInfoCircle className="text-blue-400 text-2xl" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">PROCESO</h3>
                        <p className="text-gray-400 text-sm">Validando transacción con el banco</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm py-5 px-6 rounded-xl mb-10 opacity-0 animate-fade-up delay-700 border border-yellow-500/30">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <FaClock className="text-yellow-400 text-xl" />
                    <h3 className="font-bold text-yellow-400 text-lg">Tiempo de procesamiento</h3>
                  </div>
                  <p className="text-gray-300">
                    El proceso puede tomar de <strong className="text-yellow-400">5 a 15 minutos</strong>
                  </p>
                </div>

                <div className="flex justify-center mb-10 opacity-0 animate-fade-up delay-800">
                  <Link to="/usuario/mis-reservaciones">
                    <button className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <FaHome />
                      Ir a mis reservaciones
                    </button>
                  </Link>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm py-5 px-6 rounded-xl opacity-0 animate-fade-up delay-900 border border-white/10">
                  <p className="text-gray-300">
                    <strong className="text-yellow-400">¿Tienes dudas sobre tu pago?</strong> Contáctanos por{" "}
                    <a 
                      href="https://wa.me/51947932022" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>{" "}
                    al <span className="font-mono font-semibold text-gray-200">947 932 022</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PagoPendiente;