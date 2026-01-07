import { FaTimesCircle, FaExclamationTriangle, FaCreditCard, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import BotonSecundario from "../../componentes/ui/botones/BotonSecundario";
import NombreEmpresa from "../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../assets/imagenes/Logo.svg";

const PagoFallido = () => {
  return (
    <section className="w-full bg-azul-secundario py-12 min-h-screen">
      <div className="bg-white py-12 px-8 rounded-2xl mx-4 md:mx-20 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-6 rounded-full">
              <FaTimesCircle className="text-red-500 text-6xl" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pago Fallido
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Lo sentimos, no pudimos procesar tu pago. Por favor, intenta nuevamente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <h3 className="font-bold text-gray-800 text-lg ml-2">POSIBLES CAUSAS</h3>
              </div>
              <ul className="text-gray-600 text-left list-disc list-inside">
                <li>Fondos insuficientes</li>
                <li>Tarjeta bloqueada</li>
                <li>Datos incorrectos</li>
                <li>Límite excedido</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <FaCreditCard className="text-blue-500 text-xl" />
                <h3 className="font-bold text-gray-800 text-lg ml-2">RECOMENDACIONES</h3>
              </div>
              <ul className="text-gray-600 text-left list-disc list-inside">
                <li>Verifica los datos de tu tarjeta</li>
                <li>Contacta a tu banco</li>
                <li>Intenta con otro método de pago</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Link to="/">
              <BotonSecundario className="flex items-center bg-red-600 hover:bg-red-700">
                <FaHome className="mr-2" />
                Volver al Inicio
              </BotonSecundario>
            </Link>
          </div>

          <div className="bg-gray-100 py-4 px-6 rounded-lg">
            <p className="text-gray-600">
              <strong>¿Necesitas ayuda?</strong> Contáctanos al{" "}
              <span className="text-azul-secundario">947932022</span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="flex items-center justify-center mb-4">
          <img src={Logo} alt="Super Pollo Logo" className="h-16 mr-3" />
          <img src={NombreEmpresa} alt="SUPER POLLO" className="h-8" />
        </div>
        <p className="text-white text-sm">
          Super Pollo - Donde los mejores momentos se comparten
        </p>
      </div>
    </section>
  );
};

export default PagoFallido;