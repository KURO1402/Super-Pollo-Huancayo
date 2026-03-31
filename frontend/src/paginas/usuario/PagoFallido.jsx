import { FaTimesCircle, FaExclamationTriangle, FaCreditCard, FaHome, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const PagoFallido = () => {
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
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-linear-to-br from-red-500 to-red-600 p-5 rounded-full shadow-lg">
                      <FaTimesCircle className="text-white text-5xl" />
                    </div>
                  </div>
                </div>

                <div className="mb-8 opacity-0 animate-fade-up delay-300">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="block w-8 h-px bg-amarillo" />
                    <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">
                      TRANSACCIÓN RECHAZADA
                    </span>
                    <span className="block w-8 h-px bg-amarillo" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    PAGO{" "}
                    <span className="text-rojo relative inline-block">
                      FALLIDO
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-rojo rounded-full opacity-50" />
                    </span>
                  </h1>
                  <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
                </div>

                <p className="text-gray-300 text-lg mb-4 opacity-0 animate-fade-up delay-400">
                  Lo sentimos, no pudimos procesar tu pago
                </p>
                <p className="text-gray-400 mb-10 opacity-0 animate-fade-up delay-500">
                  Por favor, intenta nuevamente con otro método de pago o verifica los datos de tu tarjeta
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 opacity-0 animate-fade-up delay-600">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-red-300 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-300" />
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-red-500/10 p-3 rounded-full mb-4">
                          <FaExclamationTriangle className="text-red-400 text-2xl" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-3">POSIBLES CAUSAS</h3>
                        <ul className="text-gray-400 text-sm text-left space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            Fondos insuficientes
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            Tarjeta bloqueada
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            Datos incorrectos
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            Límite excedido
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-blue-300 rounded-xl opacity-0 group-hover:opacity-30 transition-all duration-300" />
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                          <FaCreditCard className="text-blue-400 text-2xl" />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-3">RECOMENDACIONES</h3>
                        <ul className="text-gray-400 text-sm text-left space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Verifica los datos de tu tarjeta
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Contacta a tu banco
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Intenta con otro método de pago
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 opacity-0 animate-fade-up delay-700">
                  <Link to="/usuario/mis-reservaciones">
                    <button className="w-full sm:w-auto bg-linear-to-r from-rojo to-rojo/80 hover:from-rojo/90 hover:to-rojo text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <FaArrowLeft />
                      Ver mis reservaciones
                    </button>
                  </Link>
                  <Link to="/">
                    <button className="w-full sm:w-auto bg-gray-800/80 backdrop-blur-sm border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <FaHome />
                      Volver al Inicio
                    </button>
                  </Link>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm py-5 px-6 rounded-xl opacity-0 animate-fade-up delay-800 border border-white/10">
                  <p className="text-gray-300">
                    <strong className="text-rojo">¿Necesitas ayuda?</strong> Contáctanos por{" "}
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

export default PagoFallido;