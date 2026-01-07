import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import BotonSecundario from "../../componentes/ui/botones/BotonSecundario";
import NombreEmpresa from "../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../assets/imagenes/Logo.svg";

const TerminosCondiciones = () => {
  return (
    <section className="w-full bg-azul-secundario py-12 min-h-screen">
      <div className="bg-white py-12 px-8 rounded-2xl mx-4 md:mx-20 shadow-lg">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-gray-600 text-lg">
              Última actualización: {new Date().getFullYear()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">1. Aceptación de los Términos</h2>
              </div>
              <p className="mb-4">
                Al acceder y utilizar los servicios de Super Pollo, usted acepta estar sujeto a estos términos y condiciones en su totalidad. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestros servicios.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">2. Servicios Ofrecidos</h2>
              </div>
              <p className="mb-4">
                Super Pollo ofrece servicios de venta de pollo a la brasa y productos relacionados a través de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reservas de mesas en nuestro restaurante</li>
                <li>Promociones y ofertas especiales</li>
              </ul>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Pedidos y Pagos</h2>
              <p className="mb-4">
                Todos los pedidos están sujetos a disponibilidad. Los precios están expresados en soles peruanos (S/) e incluyen IGV. Aceptamos los siguientes métodos de pago:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tarjetas de crédito y débito</li>
                <li>Transferencias bancarias</li>
              </ul>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">4. Política de Cancelación</h2>
              </div>
              <p className="mb-4">
              Si por algún motivo requiere cancelar su reserva o servicio, por favor comuníquese con nosotros utilizando los datos de contacto que encontrará en el pie de página. Nuestro personal estará disponible para atender su solicitud y orientarlo en los pasos a seguir.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Propiedad Intelectual</h2>
              <p className="mb-4">
                Todo el contenido del sitio web, incluyendo logotipos, imágenes, textos y diseño, es propiedad de Super Pollo y está protegido por las leyes de propiedad intelectual.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitación de Responsabilidad</h2>
              <p className="mb-4">
                Super Pollo no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso de nuestros servicios.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Modificaciones de los Términos</h2>
              <p className="mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
            </div>

            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Contacto</h2>
              <p className="mb-2">
                Si tiene alguna pregunta sobre estos términos y condiciones, contáctenos:
              </p>
              <p className="text-blue-700">
                947932022 | superpollohuancayo@gmail.com
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
          Super Pollo - Donde los mejores momentos se comparten
        </p>
      </div>
    </section>
  );
};

export default TerminosCondiciones;