import { FaLocationDot, FaClock } from "react-icons/fa6";
import LocalSuperPollo from "../assets/imagenes/LocalSuperPollo.png";
import PolloHorno from "../assets/imagenes/PollosHorno.png";
import TarjetaCompacta from "../componentes/ui/tarjetas/TarjetaCompacta";
import TarjetaImagen from "../componentes/ui/tarjetas/TarjetaImagen";
import TarjetaInformativa from "../componentes/ui/tarjetas/TarjetaInformativa";
import MapaSuperPollo from "../componentes/MapaSuperPollo";

const NosotrosSeccion = () => {
  return (
    <section
      id="nosotros"
      className="bg-azul-secundario relative w-full py-20 md:py-24 lg:py-32 px-6 md:px-10 lg:px-16 overflow-hidden"
      aria-labelledby="nosotros-cabecera"
    >
      {/* Luces ambientales de fondo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-125 h-125 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #f4b942 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Encabezado de sección centrado ── */}
        <div className="text-center mb-14 md:mb-18 opacity-0 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-amarillo" />
            <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">
              Nuestra historia
            </span>
            <span className="block w-8 h-px bg-amarillo" />
          </div>
          <h2
            id="nosotros-cabecera"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          >
            SOBRE{" "}
            <span className="text-rojo relative inline-block">
              NOSOTROS
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-rojo rounded-full opacity-50" />
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
        </div>

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Columna izquierda: Mapa + Tarjeta informativa ── */}
          <div className="order-2 lg:order-1 opacity-0 animate-fade-up delay-200">
            {/* Marco decorativo */}
            <div className="relative">
              <div className="absolute -inset-3 border border-rojo/20 rounded-2xl z-0 hidden md:block" />
              <div className="absolute -inset-6 border border-amarillo/10 rounded-3xl z-0 hidden md:block" />

              {/* Mapa */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] z-10 ring-1 ring-white/10">
                <MapaSuperPollo direccion="Jr. Ica 324, Huancayo" />
              </div>
            </div>

            {/* Tarjeta informativa debajo del mapa */}
            <TarjetaInformativa
              icono={<FaLocationDot />}
              titulo="VISÍTANOS"
              descripcion="Jr. Ica 324, Huancayo"
              detalles="Lun - Dom: 10:00 AM – 9:00 PM"
            />
          </div>

          {/* ── Columna derecha: Texto + Stats + Imágenes ── */}
          <div className="order-1 lg:order-2 opacity-0 animate-fade-up delay-300">

            {/* Descripción */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10">
              <span className="text-white font-semibold">SUPER POLLO</span> es una
              empresa que viene trabajando desde hace 32 años. Brindamos una
              atención de calidad, productos deliciosos y recetas que conquistan
              cada paladar. Contamos con un equipo comprometido, ambientes
              reconfortantes y un servicio pensado para que cada visita sea
              especial.{" "}
              <span className="text-amarillo font-medium">
                Aquí cada detalle importa y cada cliente es parte de nuestra familia.
              </span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 opacity-0 animate-fade-up delay-400">
              <TarjetaCompacta titulo="32+" descripcion="Años de experiencia" />
              <TarjetaCompacta titulo="100%" descripcion="Calidad garantizada" />
              <TarjetaCompacta titulo="500+" descripcion="Clientes satisfechos" />
            </div>

            {/* Imágenes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 opacity-0 animate-fade-up delay-500">
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