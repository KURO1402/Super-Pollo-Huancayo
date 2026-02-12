import { FaArrowUp } from "react-icons/fa6";

const BotonFlotante = () => {
  return (
    <div className="flex flex-col items-end gap-2">
      <a
        href="#introduccion"
        className="bg-linear-to-r from-amarillo to-amber-500 
                   hover:from-yellow-500
                   text-white rounded-2xl w-14 h-14 
                   flex items-center justify-center 
                   shadow-lg hover:shadow-xl 
                   transition-all duration-300 
                   hover:scale-110 active:scale-95 
                   border-2 border-white/20
                   group"
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <FaArrowUp className="text-2xl group-hover:-translate-y-1 transition-transform duration-300" />
      </a>
    </div>
  );
};

export default BotonFlotante;