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
    .filter((m) => m.id !== MENSAJE_BIENVENIDA.id) 
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
        { id: idBot, rol: 'bot', texto: '', hora: formatearHora(), grafico: null }, 
      ],
      enviando: true,
      error: null,
    }));

    try {
      const resultadoFinal = await enviarMensajePollobot(
        textoUsuario.trim(),
        historialPrevio,
        (textoEnVivo, graficoEnVivo) => {
          set((state) => ({
            mensajes: state.mensajes.map((m) =>
              m.id === idBot 
                ? { ...m, texto: textoEnVivo, grafico: graficoEnVivo } 
                : m
            ),
          }));
        }
      );

      set((state) => ({
        mensajes: state.mensajes.map((m) =>
          m.id === idBot 
            ? { 
                ...m, 
                texto: resultadoFinal.texto || 'Aquí tienes el análisis visual solicitado:', 
                grafico: resultadoFinal.grafico 
              } 
            : m
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

  nuevaConversacion: () => {
    set({
      mensajes: [{ ...MENSAJE_BIENVENIDA, id: generarId(), hora: formatearHora(), grafico: null }],
      enviando: false,
      error: null,
    });
  },

  limpiarError: () => set({ error: null }),
}));