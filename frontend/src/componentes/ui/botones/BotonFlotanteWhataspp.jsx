import { FaWhatsapp } from "react-icons/fa6";

const BotonFlotanteWhataspp = ({
  numeroTelefono = "938896062",
  mensaje = 'Hola, me gustaría obtener más información sobre Super Pollo'
}) => {
  const handleClick = () => {
    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-linear-to-br from-green-500 to-green-600 
                 hover:from-green-600 hover:to-green-700 
                 text-white rounded-full w-14 h-14 
                 flex items-center justify-center 
                 shadow-lg hover:shadow-xl 
                 transition-all duration-300 
                 hover:scale-110 active:scale-95 
                 border-2 border-white/20
                 group cursor-pointer"
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="text-2xl group-hover:rotate-12 transition-transform" />
    </button>
  );
};

export default BotonFlotanteWhataspp;