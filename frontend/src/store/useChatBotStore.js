import { create } from 'zustand';
import { enviarMensajePollobot } from '../servicios/chatBotServicio';

let idContador = 1;
const generarId = () => idContador++;

const formatearHora = () =>
  new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

const MENSAJE_BIENVENIDA = {
  id: generarId(),
  rol: 'bot',
  texto: 'Hola 👋 Soy Pollobot, tu asistente del panel. Puedo ayudarte con ventas, stock, reportes o dudas del sistema. ¿En qué puedo ayudarte?',
  hora: formatearHora(),
  grafico: null,
};

const construirHistorialGemini = (mensajes) =>
  mensajes
    .filter((m) => m.id !== MENSAJE_BIENVENIDA.id) // el saludo no se manda como historial real
    .map((m) => ({
      role: m.rol === 'bot' ? 'model' : 'user',
      parts: [{ text: m.texto }],
    }));

export const useChatBotStore = create((set, get) => ({
  mensajes: [MENSAJE_BIENVENIDA],
  enviando: false,
  error: null,

  enviarMensaje: async (textoUsuario) => {
    if (!textoUsuario?.trim() || get().enviando) return;

    const idUsuario = generarId();
    const idBot = generarId();
    const historialPrevio = construirHistorialGemini(get().mensajes);

    set((state) => ({
      mensajes: [
        ...state.mensajes,
        { id: idUsuario, rol: 'usuario', texto: textoUsuario.trim(), hora: formatearHora() },
        { id: idBot, rol: 'bot', texto: '', hora: formatearHora(), grafico: null }, // placeholder — muestra el typing de MensajeChat mientras está vacío
      ],
      enviando: true,
      error: null,
    }));

    try {
      const { texto, grafico } = await enviarMensajePollobot(textoUsuario.trim(), historialPrevio);

      set((state) => ({
        mensajes: state.mensajes.map((m) =>
          m.id === idBot ? { ...m, texto: texto || '', grafico: grafico || null } : m
        ),
      }));
    } catch (err) {
      const mensajeError = err.message || 'No se pudo conectar con el asistente.';
      set({ error: mensajeError });
      set((state) => ({
        mensajes: state.mensajes.map((m) =>
          m.id === idBot
            ? { ...m, texto: 'Lo siento, ocurrió un error al procesar tu mensaje. Intenta de nuevo.' }
            : m
        ),
      }));
    } finally {
      set({ enviando: false });
    }
  },

  /** Reinicia la conversación actual */
  nuevaConversacion: () => {
    set({
      mensajes: [{ ...MENSAJE_BIENVENIDA, id: generarId(), hora: formatearHora(), grafico: null }],
      enviando: false,
      error: null,
    });
  },

  limpiarError: () => set({ error: null }),
}));