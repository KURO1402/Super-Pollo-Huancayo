import { useState, useRef, useEffect } from 'react';
import {FiX, FiSend, FiMaximize2, FiMoreHorizontal, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { FaFeather } from 'react-icons/fa';
import MensajeChat from './MensajeChat';
import { useChatBotStore } from '../../../store/useChatBotStore';

const VentanaChat = ({ abierto, alCerrar }) => {
  const [expandido, setExpandido] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const finMensajesRef = useRef(null);
  const menuRef = useRef(null);

  const mensajes = useChatBotStore((state) => state.mensajes);
  const enviando = useChatBotStore((state) => state.enviando);
  const enviarMensaje = useChatBotStore((state) => state.enviarMensaje);
  const nuevaConversacion = useChatBotStore((state) => state.nuevaConversacion);

  const respuestasRapidas = [
    'Ver ventas de hoy',
    'Productos con stock bajo',
    '¿Cómo genero un reporte?',
  ];

  const idUltimoMensaje = mensajes[mensajes.length - 1]?.id;

  // Cierra el menú de opciones (los 3 puntitos) al hacer click afuera
  useEffect(() => {
    const manejarClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };
    document.addEventListener('mousedown', manejarClickAfuera);
    return () => document.removeEventListener('mousedown', manejarClickAfuera);
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (abierto) {
      finMensajesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [abierto, mensajes, expandido]);

  if (!abierto) return null;

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!mensaje.trim() || enviando) return;
    enviarMensaje(mensaje);
    setMensaje('');
  };

  return (
    <div
      className={`fixed z-[999] bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-2xl shadow-2xl flex flex-col overflow-hidden
        transition-all duration-200 ease-in-out
        ${
          expandido
            ? 'bottom-6 right-6 w-[420px] h-[640px] max-h-[85vh]'
            : 'bottom-24 right-6 w-[340px] h-[480px] max-h-[70vh]'
        }`}
    >
      {/* ── Cabecera ───────────────────────────────────────────────── */}
      <div className="bg-orange-600 dark:bg-orange-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <FaFeather className="text-white" size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-tight">Pollobot</p>
          <p className="text-white/85 text-xs flex items-center gap-1.5 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Asistente del panel
          </p>
        </div>

        <div className="flex items-center gap-1 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMostrarMenu((v) => !v)}
            aria-label="Más opciones"
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
          >
            <FiMoreHorizontal size={18} />
          </button>

          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            aria-label={expandido ? 'Reducir ventana' : 'Expandir ventana'}
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
          >
            <FiMaximize2 size={16} />
          </button>

          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar chat"
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
          >
            <FiX size={18} />
          </button>

          {/* Menú desplegable de los 3 puntitos */}
          {mostrarMenu && (
            <div className="absolute top-9 right-9 w-52 bg-white dark:bg-gray-700
              rounded-xl shadow-lg border border-gray-100 dark:border-gray-600
              py-1 text-sm overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  nuevaConversacion();
                  setMostrarMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-gray-700 dark:text-gray-200
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <FiRefreshCw size={15} />
                Nueva conversación
              </button>
              <button
                type="button"
                onClick={() => {
                  nuevaConversacion();
                  setMostrarMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-red-600 dark:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiTrash2 size={15} />
                Borrar conversación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Cuerpo de mensajes ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 dark:bg-gray-900/40">
        {mensajes.map((m) => (
          <MensajeChat
            key={m.id}
            rol={m.rol}
            texto={m.texto}
            hora={m.hora}
            grafico={m.grafico || null}
            esUltimoBot={m.rol === 'bot' && m.id === idUltimoMensaje}
            cargandoRespuesta={enviando}
          />
        ))}

        {/* Respuestas rápidas — solo se muestran tras el mensaje de bienvenida */}
        {mensajes.length === 1 && !enviando && (
          <div className="flex flex-wrap gap-2 pl-9">
            {respuestasRapidas.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMensaje(r)}
                className="text-xs px-3 py-1.5 rounded-full
                  bg-orange-50 dark:bg-orange-900/30
                  text-orange-700 dark:text-orange-300
                  border border-orange-200 dark:border-orange-800
                  hover:bg-orange-100 dark:hover:bg-orange-900/50
                  transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        <div ref={finMensajesRef} />
      </div>

      {/* ── Input de mensaje ───────────────────────────────────────── */}
      <form
        onSubmit={handleEnviar}
        className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0"
      >
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder={enviando ? 'Pollobot está escribiendo...' : 'Escribe un mensaje...'}
          disabled={enviando}
          className="flex-1 text-sm rounded-full px-4 py-2.5
            bg-gray-100 dark:bg-gray-700
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            border-none outline-none
            disabled:opacity-60
            focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-700"
        />
        <button
          type="submit"
          disabled={!mensaje.trim() || enviando}
          aria-label="Enviar mensaje"
          className="w-9 h-9 rounded-full flex-shrink-0
            bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600
            disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:cursor-not-allowed
            text-white flex items-center justify-center transition-colors"
        >
          <FiSend size={15} />
        </button>
      </form>
    </div>
  );
};

export default VentanaChat;