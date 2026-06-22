import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSend,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiMenu,
  FiX,
  FiMoreVertical,
  FiArrowLeft,
} from 'react-icons/fi';
import { FaFeather } from 'react-icons/fa';
import MensajeChat from '../../componentes/panel-admin/chatbot/MensajeChat';

/**
 * AsistentePollobotPagina
 *
 * Página de historial completo del asistente Pollobot, en la ruta
 * /admin/asistente-pollobot. Es una ruta STANDALONE — NO vive dentro de
 * EstructuraBaseAdmin, por eso ocupa toda la pantalla sin heredar el
 * MenuLateral ni la Cabecera del panel. Incluye su propio botón "Volver".
 *
 * Reutiliza MensajeChat para mantener consistencia visual con la
 * ventana flotante.
 *
 * Aún NO consume ningún store ni servicio — las conversaciones y
 * mensajes son datos estáticos de ejemplo, listos para conectar
 * después a un store real (ej. usePollobotStore).
 */

// ─── Datos de ejemplo (placeholder) ──────────────────────────────────────────

const CONVERSACIONES_EJEMPLO = [
  {
    id: 1,
    titulo: 'Ventas de hoy',
    ultimoMensaje: 'Tus ventas de hoy suman S/ 845.50',
    fecha: 'Hoy, 10:42 a.m.',
  },
  {
    id: 2,
    titulo: 'Stock de pollo entero',
    ultimoMensaje: 'Quedan 12 unidades en almacén principal',
    fecha: 'Hoy, 9:15 a.m.',
  },
  {
    id: 3,
    titulo: 'Cómo generar un reporte',
    ultimoMensaje: 'Puedes ir a la sección Reportes y seleccionar...',
    fecha: 'Ayer',
  },
  {
    id: 4,
    titulo: 'Cierre de caja del lunes',
    ultimoMensaje: 'El cierre del lunes 16 tuvo una diferencia de...',
    fecha: '16 jun',
  },
  {
    id: 5,
    titulo: 'Productos más vendidos',
    ultimoMensaje: 'El combo familiar fue el más vendido esta semana',
    fecha: '12 jun',
  },
];

const MENSAJES_POR_CONVERSACION = {
  1: [
    { id: 1, rol: 'bot', texto: 'Hola 👋 Soy Pollobot. ¿En qué puedo ayudarte hoy?', hora: '10:40 a.m.' },
    { id: 2, rol: 'usuario', texto: '¿Cuánto llevamos vendido hoy?', hora: '10:41 a.m.' },
    { id: 3, rol: 'bot', texto: 'Tus ventas de hoy suman S/ 845.50, repartidas en 34 comprobantes. El método de pago más usado fue Yape.', hora: '10:42 a.m.' },
  ],
  2: [
    { id: 1, rol: 'bot', texto: 'Hola 👋 Soy Pollobot. ¿En qué puedo ayudarte hoy?', hora: '9:14 a.m.' },
    { id: 2, rol: 'usuario', texto: '¿Cuánto stock de pollo entero queda?', hora: '9:14 a.m.' },
    { id: 3, rol: 'bot', texto: 'Quedan 12 unidades en almacén principal. Te recomiendo hacer un pedido pronto, tu consumo promedio diario es de 8 unidades.', hora: '9:15 a.m.' },
  ],
  3: [
    { id: 1, rol: 'bot', texto: 'Hola 👋 Soy Pollobot. ¿En qué puedo ayudarte hoy?', hora: 'Ayer, 4:02 p.m.' },
    { id: 2, rol: 'usuario', texto: '¿Cómo genero un reporte de ventas mensual?', hora: 'Ayer, 4:03 p.m.' },
    { id: 3, rol: 'bot', texto: 'Puedes ir a la sección Reportes y seleccionar el rango de fechas que necesites, luego presiona "Generar PDF" o "Exportar a Excel".', hora: 'Ayer, 4:03 p.m.' },
  ],
  4: [
    { id: 1, rol: 'usuario', texto: '¿Cómo cerró la caja del lunes?', hora: '16 jun, 8:30 p.m.' },
    { id: 2, rol: 'bot', texto: 'El cierre del lunes 16 tuvo una diferencia de S/ -5.00 entre el monto esperado y el monto contado.', hora: '16 jun, 8:31 p.m.' },
  ],
  5: [
    { id: 1, rol: 'usuario', texto: '¿Cuál fue el producto más vendido esta semana?', hora: '12 jun, 1:10 p.m.' },
    { id: 2, rol: 'bot', texto: 'El combo familiar fue el más vendido esta semana con 87 unidades, seguido del 1/4 pollo con papas.', hora: '12 jun, 1:11 p.m.' },
  ],
};

const RESPUESTAS_RAPIDAS = [
  'Ver ventas de hoy',
  'Productos con stock bajo',
  '¿Cómo genero un reporte?',
];

// ─── Sub-componente: item de conversación en la lista lateral ──────────────

const ItemConversacion = ({ conversacion, activa, onClick, onEliminar }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group w-full text-left px-3.5 py-3 rounded-xl flex items-start gap-2.5
      transition-colors
      ${
        activa
          ? 'bg-orange-50 dark:bg-orange-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700/60'
      }`}
  >
    <div className="flex-1 min-w-0">
      <p
        className={`text-sm font-medium truncate
          ${activa ? 'text-orange-700 dark:text-orange-300' : 'text-gray-800 dark:text-gray-100'}`}
      >
        {conversacion.titulo}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
        {conversacion.ultimoMensaje}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
        {conversacion.fecha}
      </p>
    </div>

    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onEliminar(conversacion.id);
      }}
      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500
        dark:text-gray-500 dark:hover:text-red-400 p-1 rounded-lg transition-opacity flex-shrink-0"
      aria-label="Eliminar conversación"
    >
      <FiTrash2 size={14} />
    </span>
  </button>
);

// ─── Página principal ────────────────────────────────────────────────────────

const AsistenteChatBotPagina = () => {
  const [conversaciones, setConversaciones] = useState(CONVERSACIONES_EJEMPLO);
  const [conversacionActivaId, setConversacionActivaId] = useState(CONVERSACIONES_EJEMPLO[0].id);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [sidebarAbierta, setSidebarAbierta] = useState(true); // desktop: visible | mobile: drawer
  const finMensajesRef = useRef(null);

  const mensajesActuales = MENSAJES_POR_CONVERSACION[conversacionActivaId] || [];

  const conversacionesFiltradas = conversaciones.filter((c) =>
    c.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversacionActivaId]);

  const handleNuevaConversacion = () => {
    // TODO: conectar con store/servicio — por ahora solo resetea la vista
    setConversacionActivaId(null);
  };

  const handleEliminarConversacion = (id) => {
    // TODO: conectar con store/servicio
    setConversaciones((prev) => prev.filter((c) => c.id !== id));
    if (conversacionActivaId === id) {
      setConversacionActivaId(null);
    }
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    // TODO: conectar con store/servicio de IA — por ahora no hace nada
    setMensaje('');
  };

  const conversacionActiva = conversaciones.find((c) => c.id === conversacionActivaId);

  return (
    <div className="w-full h-screen flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 flex overflow-hidden">
        {/* ── Sidebar de conversaciones ──────────────────────────────── */}
        <aside
          className={`flex-shrink-0 border-r border-gray-200 dark:border-gray-700
            flex flex-col transition-all duration-200
            ${sidebarAbierta ? 'w-72' : 'w-0 overflow-hidden'}`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Conversaciones
              </h2>
              <button
                type="button"
                onClick={() => setSidebarAbierta(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                aria-label="Cerrar panel de conversaciones"
              >
                <FiX size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNuevaConversacion}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700
                dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-medium
                py-2.5 rounded-xl transition-colors"
            >
              <FiPlus size={16} />
              Nueva conversación
            </button>

            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg
                  bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  border-none outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-700"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversacionesFiltradas.length === 0 ? (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8 px-4">
                No se encontraron conversaciones
              </p>
            ) : (
              conversacionesFiltradas.map((c) => (
                <ItemConversacion
                  key={c.id}
                  conversacion={c}
                  activa={c.id === conversacionActivaId}
                  onClick={() => setConversacionActivaId(c.id)}
                  onEliminar={handleEliminarConversacion}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Panel principal del chat ──────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link
              to="/admin"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5
                rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Volver al panel"
            >
              <FiArrowLeft size={18} />
            </Link>

            {!sidebarAbierta && (
              <button
                type="button"
                onClick={() => setSidebarAbierta(true)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5
                  rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Mostrar conversaciones"
              >
                <FiMenu size={18} />
              </button>
            )}

            <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/40
              flex items-center justify-center flex-shrink-0">
              <FaFeather className="text-orange-600 dark:text-orange-400" size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {conversacionActiva ? conversacionActiva.titulo : 'Nueva conversación'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Pollobot · Asistente del panel
              </p>
            </div>

            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5
                rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Más opciones"
            >
              <FiMoreVertical size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50 dark:bg-gray-900/40">
            {mensajesActuales.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/40
                  flex items-center justify-center mb-4">
                  <FaFeather className="text-orange-600 dark:text-orange-400" size={26} />
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                  ¡Hola! Soy Pollobot
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
                  Puedo ayudarte con ventas, stock, reportes o dudas del sistema.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {RESPUESTAS_RAPIDAS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMensaje(r)}
                      className="text-xs px-3.5 py-2 rounded-full
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
              </div>
            ) : (
              <>
                {mensajesActuales.map((m) => (
                  <MensajeChat key={m.id} rol={m.rol} texto={m.texto} hora={m.hora} />
                ))}
                <div ref={finMensajesRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleEnviar}
            className="flex items-center gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 text-sm rounded-full px-4 py-3
                bg-gray-100 dark:bg-gray-700
                text-gray-800 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border-none outline-none
                focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-700"
            />
            <button
              type="submit"
              disabled={!mensaje.trim()}
              aria-label="Enviar mensaje"
              className="w-11 h-11 rounded-full flex-shrink-0
                bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600
                disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:cursor-not-allowed
                text-white flex items-center justify-center transition-colors"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AsistenteChatBotPagina;