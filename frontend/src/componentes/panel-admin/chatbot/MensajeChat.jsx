import { FaFeather } from 'react-icons/fa';

/**
 * Burbuja de mensaje individual dentro del chat.
 *
 * Props:
 * - rol: 'bot' | 'usuario'
 * - texto: string
 * - hora: string (ej. "10:42 a.m.")
 */
const MensajeChat = ({ rol, texto, hora }) => {
  const esBot = rol === 'bot';

  if (esBot) {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40
          flex items-center justify-center shrink-0 mt-0.5">
          <FaFeather className="text-orange-600 dark:text-orange-400" size={12} />
        </div>
        <div className="max-w-[78%]">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100
            rounded-2xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed">
            {texto}
          </div>
          {hora && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 ml-1">
              Pollobot · {hora}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[78%]">
        <div className="bg-orange-600 dark:bg-orange-500 text-white
          rounded-2xl rounded-tr-sm px-3 py-2 text-sm leading-relaxed">
          {texto}
        </div>
        {hora && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 mr-1 text-right">
            {hora}
          </p>
        )}
      </div>
    </div>
  );
};

export default MensajeChat;