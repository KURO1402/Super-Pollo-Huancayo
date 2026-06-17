import { useState } from 'react';
import { FiX, FiMoreVertical, FiSend } from 'react-icons/fi';

const VentanaChatbot = ({ abierta, onCerrar, onExpandir }) => {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      texto: 'Hola 👋 ¿En qué puedo ayudarte?',
      remitente: 'aria',
      timestamp: new Date(),
      acciones: ['Ver ventas de hoy', 'Stock bajo', 'Ayuda']
    }
  ]);
  const [entrada, setEntrada] = useState('');
  const [mostrarMenuOpciones, setMostrarMenuOpciones] = useState(false);

  const manejarEnvioMensaje = () => {
    if (entrada.trim() === '') return;

    // Agregar mensaje del usuario
    const nuevoMensaje = {
      id: mensajes.length + 1,
      texto: entrada,
      remitente: 'usuario',
      timestamp: new Date()
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setEntrada('');

    // Simular respuesta de Aria
    setTimeout(() => {
      const respuesta = {
        id: mensajes.length + 2,
        texto: 'He recibido tu mensaje. Estoy aquí para ayudarte. 🤖',
        remitente: 'aria',
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, respuesta]);
    }, 500);
  };

  const manejarAccion = (accion) => {
    const mensajeSistema = {
      id: mensajes.length + 1,
      texto: accion,
      remitente: 'usuario',
      timestamp: new Date()
    };

    setMensajes([...mensajes, mensajeSistema]);

    // Simular respuesta de Aria
    setTimeout(() => {
      const respuesta = {
        id: mensajes.length + 2,
        texto: `Procesando: ${accion}. Esta función estará disponible pronto. ⏳`,
        remitente: 'aria',
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, respuesta]);
    }, 500);
  };

  if (!abierta) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">Aria</h3>
          <p className="text-orange-100 text-xs">Asistente inteligente</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de opciones */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMostrarMenuOpciones(!mostrarMenuOpciones)}
              className="p-2 hover:bg-orange-400 dark:hover:bg-orange-500 rounded-lg transition-colors duration-200"
              aria-label="Más opciones"
            >
              <FiMoreVertical className="w-5 h-5 text-white" />
            </button>

            {/* Menú de opciones */}
            {mostrarMenuOpciones && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10">
                {/* <button
                  type="button"
                  onClick={onExpandir}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium transition-colors duration-200 border-b border-gray-200 dark:border-gray-600"
                >
                  Expandir ventana
                </button> */}
                <button
                  type="button"
                  onClick={() => setMensajes([mensajes[0]])}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium transition-colors duration-200"
                >
                  Limpiar historial
                </button>
              </div>
            )}
          </div>
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onCerrar}
            className="p-2 hover:bg-orange-400 dark:hover:bg-orange-500 rounded-lg transition-colors duration-200"
            aria-label="Cerrar chat"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {mensajes.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            {/* Avatar */}
            {msg.remitente === 'aria' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </div>
            )}

            <div className={`flex-1 flex ${msg.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`
                  max-w-xs px-4 py-3 rounded-lg
                  ${msg.remitente === 'usuario'
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <p className="text-sm font-medium">{msg.texto}</p>
              </div>
            </div>

            {msg.remitente === 'usuario' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm">
                  👤
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Acciones de respuesta rápida */}
        {mensajes.length > 0 && mensajes[mensajes.length - 1].acciones && (
          <div className="space-y-2 pt-2">
            {mensajes[mensajes.length - 1].acciones.map((accion, idx) => (
              <button
                key={idx}
                onClick={() => manejarAccion(accion)}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm font-medium text-center
                  transition-colors duration-200
                  border border-orange-500
                  text-orange-600 dark:text-orange-400
                  bg-orange-50 dark:bg-orange-500/10
                  hover:bg-orange-100 dark:hover:bg-orange-500/20
                `}
              >
                {accion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && manejarEnvioMensaje()}
            placeholder="Escribe un mensaje..."
            className={`
              flex-1 px-4 py-2 rounded-lg border outline-none transition-colors duration-200
              bg-gray-50 dark:bg-gray-700
              border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
              dark:focus:border-orange-500
            `}
          />
          <button
            type="button"
            onClick={manejarEnvioMensaje}
            disabled={entrada.trim() === ''}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${entrada.trim() === ''
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white hover:shadow-lg'
              }
            `}
            aria-label="Enviar mensaje"
          >
            <FiSend className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentanaChatbot;