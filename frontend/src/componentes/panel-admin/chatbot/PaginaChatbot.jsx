import { useState } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

const PaginaChatbot = ({ onVolver }) => {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      texto: 'Hola 👋 ¿En qué puedo ayudarte?',
      remitente: 'aria',
      timestamp: new Date(),
    }
  ]);
  const [entrada, setEntrada] = useState('');

  const manejarEnvioMensaje = () => {
    if (entrada.trim() === '') return;

    const nuevoMensaje = {
      id: mensajes.length + 1,
      texto: entrada,
      remitente: 'usuario',
      timestamp: new Date()
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setEntrada('');

    setTimeout(() => {
      const respuesta = {
        id: mensajes.length + 2,
        texto: 'Entendido. Estoy procesando tu solicitud. 🤖',
        remitente: 'aria',
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, respuesta]);
    }, 500);
  };

  const formatearHora = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen w-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 px-6 py-6 shadow-lg">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onVolver}
            className="p-2 hover:bg-orange-400 dark:hover:bg-orange-500 rounded-lg transition-colors duration-200"
            aria-label="Volver atrás"
          >
            <FiArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-2xl">Aria</h1>
            <p className="text-orange-100 text-sm">Asistente inteligente del sistema</p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-xs">Disponible 24/7</p>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-white text-xs font-medium">Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        {/* Área de chat */}
        <div className="flex-1 flex flex-col">
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Información de inicio */}
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl font-bold">A</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido a Aria</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Soy tu asistente inteligente. Puedo ayudarte con ventas, inventario, reportes y mucho más.
              </p>
            </div>

            {/* Mensajes del chat */}
            {mensajes.map((msg, idx) => (
              <div key={msg.id} className="flex gap-4">
                {msg.remitente === 'aria' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      A
                    </div>
                  </div>
                )}

                <div className={`flex-1 flex ${msg.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-2xl">
                    <div
                      className={`
                        px-6 py-3 rounded-lg
                        ${msg.remitente === 'usuario'
                          ? 'bg-orange-500 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                        }
                      `}
                    >
                      <p className="text-sm">{msg.texto}</p>
                    </div>
                    <p className={`text-xs mt-1 px-2 ${msg.remitente === 'usuario' ? 'text-right text-gray-500 dark:text-gray-400' : 'text-left text-gray-500 dark:text-gray-400'}`}>
                      {formatearHora(msg.timestamp)}
                    </p>
                  </div>
                </div>

                {msg.remitente === 'usuario' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm">
                      👤
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input de mensaje */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
            <div className="flex gap-4">
              <input
                type="text"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && manejarEnvioMensaje()}
                placeholder="Escribe tu pregunta..."
                className={`
                  flex-1 px-4 py-3 rounded-lg border outline-none transition-colors duration-200
                  bg-gray-50 dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
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
                  p-3 rounded-lg transition-all duration-200 flex-shrink-0
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

        {/* Panel lateral con sugerencias (desktop) */}
        <div className="hidden lg:flex flex-col w-80 border-l border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Sugerencias rápidas</h3>
          <div className="space-y-3">
            {[
              '📊 Ver ventas de hoy',
              '📦 Verificar stock bajo',
              '💰 Resumen financiero',
              '📈 Tendencias de ventas',
              '⚙️ Configuración del sistema',
              '❓ Ayuda y tutoriales'
            ].map((sugerencia, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setEntrada(sugerencia.split(' ', 2)[1] || sugerencia);
                  manejarEnvioMensaje();
                }}
                className="w-full text-left px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                {sugerencia}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Información de Aria</h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p>• Disponible las 24 horas del día</p>
              <p>• Responde en tiempo real</p>
              <p>• Integrado con todos tus datos</p>
              <p>• Aprende de tus patrones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaChatbot;