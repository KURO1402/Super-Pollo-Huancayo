import { FaWhatsapp } from "react-icons/fa";

const BotonWhatsapp = () => {
  const handleWhatsappClick = () => {
    const numeroCelular = "51947932022"; 
    const mensaje = "Hola, estoy interesado en trabajar con ustedes en SUPER POLLO";
    const whatsappUrl = `https://wa.me/${numeroCelular}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsappClick}
      className="
        group relative inline-flex items-center gap-3
        bg-transparent
        border border-green-500/60 hover:border-green-400
        text-green-400 hover:text-white
        font-semibold text-sm md:text-base
        py-3.5 px-7 rounded-full
        transition-all duration-300
        hover:bg-green-500 hover:shadow-[0_0_28px_rgba(34,197,94,0.35)]
        hover:scale-[1.03]
        overflow-hidden
      "
    >
      <span className="
        shrink-0 w-8 h-8 rounded-full
        bg-green-500/15 group-hover:bg-white/20
        flex items-center justify-center
        transition-colors duration-300
        text-base
      ">
        <FaWhatsapp />
      </span>

      <span className="tracking-wide">Contactar por WhatsApp</span>
      <span className="
        opacity-0 group-hover:opacity-100
        -translate-x-2 group-hover:translate-x-0
        transition-all duration-300
        text-xs
      ">
        →
      </span>
    </button>
  );
};

export default BotonWhatsapp;