import { FiMessageCircle } from 'react-icons/fi';

const BotonChatbotFlotante = ({ onClick, tieneNotificacion = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full
        bg-gradient-to-br from-orange-500 to-orange-600
        hover:from-orange-600 hover:to-orange-700
        dark:from-orange-600 dark:to-orange-700
        dark:hover:from-orange-500 dark:hover:to-orange-600
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        hover:scale-110 active:scale-95
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-orange-400 dark:focus:ring-offset-gray-900
        group
      `}
      aria-label="Abrir asistente Aria"
    >
      <FiMessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
      
      {/* Notificación de estado activo */}
      {tieneNotificacion && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg border-2 border-white dark:border-gray-900" />
      )}
      
      {/* Efecto de onda */}
      <div className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 group-hover:animate-pulse transition-opacity duration-300" />
    </button>
  );
};

export default BotonChatbotFlotante;