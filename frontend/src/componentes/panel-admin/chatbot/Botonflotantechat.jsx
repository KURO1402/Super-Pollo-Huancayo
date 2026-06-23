import { FiMessageSquare, FiX } from 'react-icons/fi';

/**
 * Botón flotante fijo en la esquina inferior derecha.
 * Alterna entre el ícono de chat y una "X" cuando la ventana está abierta.
 *
 * Props:
 * - abierto: boolean — si la ventana de chat está visible
 * - alClick: () => void — alterna abierto/cerrado
 */
const BotonFlotanteChat = ({ abierto, alClick }) => {
  return (
    <button
      type="button"
      onClick={alClick}
      aria-label={abierto ? 'Cerrar asistente Pollobot' : 'Abrir asistente Pollobot'}
      className="fixed bottom-6 right-6 z-999 w-14 h-14 rounded-full
        bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800"
    >
      {abierto ? (
        <FiX size={26} />
      ) : (
        <FiMessageSquare size={24} />
      )}
    </button>
  );
};

export default BotonFlotanteChat;