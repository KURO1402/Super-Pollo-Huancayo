import PersonasJuntas from "../assets/imagenes/PortadaLocal.jpg";
import BotonWhatsapp from "../componentes/ui/botones/BotonWhatsapp";

const TrabajaNosotrosSection = () => {

  return (
    <section id="trabaja" className="bg-azul-primario py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
            TRABAJA CON NOSOTROS
          </h2>
          <div className="w-24 h-1 bg-rojo mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <p className="text-xl text-gray-300 leading-relaxed">
              EN NUESTRO RESTAURANTE CREEMOS EN EL TALENTO Y LA PASIÓN DE NUESTRA GENTE. 
              SI TE GUSTA LA GASTRONOMÍA Y DISFRUTAS BRINDAR UN SERVICIO EXCEPCIONAL, 
              TE INVITAMOS A FORMAR PARTE DE NUESTRO EQUIPO.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              AQUÍ PODRÁS CRECER, APRENDER Y UNIRTE A LA FAMILIA QUE SIRVE LOS MEJORES 
              POLLOS A LA BRASA DE LA CIUDAD. VIVE LA EXPERIENCIA DE TRABAJAR CON NOSOTROS 
              Y HAZ QUE CADA VISITA SEA INOLVIDABLE.
            </p>

            <p className="text-xl text-gray-300 leading-relaxed">
              SI QUIERES SUMARTE, ESCRIBENOS AL 947932022 O HAZ CLICK EN EL BOTÓN DE ABAJO 
              PARA HABLAR POR WHATSAPP.
            </p>

            <BotonWhatsapp />
          </div>

          <div className="flex justify-center">
            <img
              src={PersonasJuntas} 
              alt="Equipo de trabajo de SUPER POLLO"
              className="w-full max-w-md rounded-2xl shadow-2xl object-cover h-96"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-8 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">Contáctanos</h3>
          <p className="text-gray-400">
            Estamos siempre buscando talento apasionado por la gastronomía y el servicio.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrabajaNosotrosSection;