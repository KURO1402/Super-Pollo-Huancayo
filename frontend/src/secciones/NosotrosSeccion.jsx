import { FaLocationDot } from "react-icons/fa6";
import LocalSuperPollo from "../assets/imagenes/LocalSuperPollo.png";
import PolloHorno from "../assets/imagenes/PollosHorno.png";
import TarjetaCompacta from "../componentes/ui/tarjetas/TarjetaCompacta";
import TarjetaImagen from "../componentes/ui/tarjetas/TarjetaImagen";
import TarjetaInformativa from "../componentes/ui/tarjetas/TarjetaInformativa";
import MapaSuperPollo from "../componentes/MapaSuperPollo";

const NosotrosSeccion = () => {
  return (
    <section id="nosotros" className="bg-azul-secundario w-full py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16" aria-labelledby="nosotros-cabecera">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 border-2 border-red-500/30 rounded-2xl z-0 hidden md:block"></div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 z-20">
              <MapaSuperPollo
                direccion = "Jr. Ica 324, Huancayo"
              />
            </div>
            <TarjetaInformativa icono={<FaLocationDot />} titulo="VISÍTANOS"  descripcion="Jr. Ica 324, Huancayo" detalles="Lun-Dom: 10:00 AM - 9:00 PM"/>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left mb-10">
              <span className="inline-block bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                NUESTRA HISTORIA
              </span>
              <h2
                id="nosotros-cabecera"
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                SOBRE <span className="text-rojo">NOSOTROS</span>
              </h2>
              <div className="w-20 h-1 bg-red-500 mx-auto lg:mx-0 mb-8"></div>
              <p className="text-gray-100 text-lg md:text-xl leading-relaxed mb-8">
                SUPER POLLO es una empresa que viene trabajando desde hace
                32 años. Brindamos una atención de calidad, productos deliciosos y
                recetas que conquistan cada paladar. Contamos con un equipo
                comprometido, ambientes reconfortantes y un servicio pensado para que
                cada visita sea especial. Aquí cada detalle importa y cada cliente es
                parte de nuestra familia.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <TarjetaCompacta titulo="32+" descripcion="Años de experiencia" />
                <TarjetaCompacta titulo="100%" descripcion="Calidad garantizada" />
                <TarjetaCompacta titulo="500+" descripcion="Clientes satisfechos" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TarjetaImagen imagen={LocalSuperPollo} titulo="Nuestro local" />
              <TarjetaImagen imagen={PolloHorno} titulo="Nuestro Producto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NosotrosSeccion;
