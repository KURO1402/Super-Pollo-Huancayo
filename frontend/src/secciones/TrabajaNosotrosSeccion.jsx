import PersonasJuntas from "../assets/imagenes/PortadaLocal.jpg";
import BotonWhatsapp from "../componentes/ui/botones/BotonWhatsapp";
import { FaSeedling, FaHandshake, FaStar, FaPhone } from "react-icons/fa6";

const beneficios = [
  { icono: <FaSeedling />, texto: "Crecimiento profesional" },
  { icono: <FaHandshake />, texto: "Ambiente familiar" },
  { icono: <FaStar />, texto: "Experiencia gastronómica" },
];

const TrabajaNosotrosSection = () => {
  return (
    <section
      id="trabaja"
      className="bg-azul-primario relative w-full py-20 md:py-28 px-6 md:px-10 lg:px-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-125 h-125 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-100 h-100 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #f4b942 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="text-center mb-14 opacity-0 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-amarillo" />
            <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">
              Únete al equipo
            </span>
            <span className="block w-8 h-px bg-amarillo" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            TRABAJA{" "}
            <span className="text-rojo relative inline-block">
              CON NOSOTROS
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-rojo rounded-full opacity-50" />
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="space-y-6 opacity-0 animate-fade-up delay-200">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              En <span className="text-white font-semibold">SUPER POLLO</span> creemos
              en el talento y la pasión de nuestra gente. Si te gusta la gastronomía
              y disfrutas brindar un servicio excepcional, te invitamos a formar parte
              de nuestro equipo.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Aquí podrás crecer, aprender y unirte a la familia que sirve los mejores
              pollos a la brasa de la ciudad.{" "}
              <span className="text-amarillo font-medium">
                Haz que cada visita sea inolvidable.
              </span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2 opacity-0 animate-fade-up delay-300">
              {beneficios.map(({ icono, texto }) => (
                <div
                  key={texto}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-rojo/30 px-4 py-2 rounded-full text-gray-200 text-sm transition-colors duration-300"
                >
                  <span className="text-rojo">{icono}</span>
                  <span>{texto}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-start gap-4 opacity-0 animate-fade-up delay-400">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-rojo/15 flex items-center justify-center text-rojo text-lg">
                <FaPhone />
              </div>
              <div>
                <p className="text-white font-semibold text-sm uppercase tracking-wider mb-0.5">
                  Contáctanos directamente
                </p>
                <p className="text-gray-400 text-sm">
                  Escríbenos al{" "}
                  <span className="text-amarillo font-medium">947 932 022</span>{" "}
                  o haz clic en el botón de abajo.
                </p>
              </div>
            </div>

            <div className="opacity-0 animate-fade-up delay-400 pt-1">
              <BotonWhatsapp />
            </div>
          </div>

          <div className="flex justify-center opacity-0 animate-fade-up delay-300">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-3 border border-rojo/20 rounded-2xl z-0 hidden md:block" />
              <div className="absolute -inset-6 border border-amarillo/10 rounded-3xl z-0 hidden md:block" />

              <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
                <img
                  src={PersonasJuntas}
                  alt="Equipo de trabajo de SUPER POLLO"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <span className="text-white text-xs font-medium">
                    ¡Estamos buscando nuevos talentos!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-center opacity-0 animate-fade-up delay-400">
          <p className="text-gray-400 text-sm">
            Siempre buscamos personas{" "}
            <span className="text-amarillo">apasionadas por la gastronomía</span>{" "}
            y el servicio al cliente.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrabajaNosotrosSection;