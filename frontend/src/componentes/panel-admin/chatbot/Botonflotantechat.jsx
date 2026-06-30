import { FiX } from 'react-icons/fi';
import pollobotImg from '../../../assets/imagenes/PolloBot.png';

const BotonFlotanteChat = ({ abierto, alClick }) => {
  return (
    <button
      type="button"
      onClick={alClick}
      aria-label={abierto ? 'Cerrar asistente Pollobot' : 'Abrir asistente Pollobot'}
      className="fixed bottom-6 right-6 z-999 w-14 h-14 rounded-full
        bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center overflow-hidden
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
    >
      {abierto ? (
        <FiX size={27} />
      ) : (
        <img
          src={pollobotImg}
          alt="PolloBot"
          className="w-full h-full object-cover scale-110"
        />
      )}
    </button>
  );
};

export default BotonFlotanteChat;