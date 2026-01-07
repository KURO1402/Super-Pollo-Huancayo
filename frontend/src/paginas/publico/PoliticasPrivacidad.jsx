import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import BotonSecundario from "../../componentes/ui/botones/BotonSecundario";
import NombreEmpresa from "../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../assets/imagenes/Logo.svg";

const PoliticasPrivacidad = () => {
  return (
    <section className="w-full bg-azul-secundario py-12 min-h-screen">
      <div className="bg-white py-12 px-8 rounded-2xl mx-4 md:mx-20 shadow-lg">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Políticas de Privacidad
            </h1>
            <p className="text-gray-600 text-lg">
              Protegemos tu información personal
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">1. Introducción</h2>
              </div>
              <p className="mb-4">
                En Super Pollo, valoramos y respetamos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestros servicios.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">2. Información que Recopilamos</h2>
              </div>
              <p className="mb-4">Recopilamos la siguiente información:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Información personal:</strong> Nombre, correo electrónico, teléfono</li>
                <li><strong>Información de reservaciones:</strong> Historial de reservaciones y preferencias</li>
                <li><strong>Datos de navegación:</strong> IP, tipo de dispositivo, páginas visitadas</li>
              </ul>
            </div>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Uso de la Información</h2>
              <p className="mb-4">Utilizamos tu información para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesar y gestionar tus reservaciones</li>
                <li>Mejorar nuestros servicios y experiencia del cliente</li>
                <li>Personalizar tu experiencia en nuestro sitio web</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">4. Protección de Datos</h2>
              </div>
              <p className="mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">5. Uso de Cookies</h2>
              </div>
              <p className="mb-4">
                Utilizamos cookies para mejorar tu experiencia de navegación. Las cookies nos ayudan a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Recordar tus preferencias</li>
                <li>Analizar el tráfico del sitio web</li>
                <li>Personalizar el contenido</li>
              </ul>
              <p className="mt-4">
                Puedes desactivar las cookies en la configuración de tu navegador.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Compartir Información</h2>
              <p className="mb-4">
                No vendemos, comerciamos ni transferimos tu información personal a terceros, excepto en los siguientes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                <li>Cumplimiento de requisitos legales</li>
                <li>Protección de nuestros derechos y seguridad</li>
              </ul>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Tus Derechos</h2>
              <p className="mb-4">Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Cambios en la Política</h2>
              <p className="mb-4">
                Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web.
              </p>
            </div>

            <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Contacto</h2>
              <p className="mb-2">
                Para ejercer tus derechos o hacer consultas sobre privacidad:
              </p>
              <p className="text-red-700 mb-2">
                947932022
              </p>
              <p className="text-red-700">
                superpollohuancayo@gmail.com
              </p>
              <p className="mt-4 text-sm text-red-600">
                Horario de atención: Lunes a Domingo - 10:00 am a 9:00 pm
              </p>
            </div>

          </div>

          <div className="flex justify-center mt-12">
            <Link to="/">
              <BotonSecundario className="flex items-center">
                <FaHome className="mr-2" />
                Volver al Inicio
              </BotonSecundario>
            </Link>
          </div>

        </div>
      </div>

      <div className="text-center mt-8">
        <div className="flex items-center justify-center mb-4">
          <img src={Logo} alt="Super Pollo Logo" className="h-16 mr-3" />
          <img src={NombreEmpresa} alt="SUPER POLLO" className="h-8" />
        </div>
        <p className="text-white text-sm">
          Super Pollo - Tu privacidad es nuestra prioridad
        </p>
      </div>
    </section>
  );
};

export default PoliticasPrivacidad;