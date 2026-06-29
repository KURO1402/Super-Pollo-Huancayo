import { useState, useRef } from 'react';

const BIENVENIDA = {
  id: 'welcome',
  rol: 'bot',
  texto: 'Hola 👋 Soy Pollobot, tu asistente del panel. Puedo ayudarte con ventas, stock, reportes o dudas del sistema. ¿En qué puedo ayudarte?',
  hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  grafico: null,
};

const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    return JSON.parse(authStorage).state.accessToken ?? null;
  } catch {
    return null;
  }
};

export const usePollobot = () => {
  const [mensajes, setMensajes] = useState([BIENVENIDA]);
  const [cargando, setCargando] = useState(false);
  const [idUltimoBot, setIdUltimoBot] = useState(null);
  const historialRef = useRef([]);

  const limpiarConversacion = () => {
    setMensajes([{ ...BIENVENIDA, hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) }]);
    historialRef.current = [];
    setIdUltimoBot(null);
  };

  const enviarMensaje = async (textoMensaje) => {
    if (!textoMensaje.trim() || cargando) return;

    const horaActual = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const idUsuario = crypto.randomUUID();
    const idBot = crypto.randomUUID();

    const msgUsuario = { id: idUsuario, rol: 'usuario', texto: textoMensaje, hora: horaActual, grafico: null };
    const msgBot = { id: idBot, rol: 'bot', texto: '', hora: horaActual, grafico: null };

    setMensajes(prev => [...prev, msgUsuario, msgBot]);
    setIdUltimoBot(idBot);
    setCargando(true);

    // Historial previo formateado para el backend (sin el placeholder vacío)
    const historialBackend = historialRef.current.map(m => ({
      role: m.rol === 'usuario' ? 'user' : 'model',
      parts: [{ text: m.texto }],
    }));

    // Guardamos el mensaje del usuario en el historial ref antes de llamar
    historialRef.current = [...historialRef.current, msgUsuario];

    let textoFinal = '';

    try {
      const token = obtenerToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ mensaje: textoMensaje, historial: historialBackend }),
      });

      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Partimos por el separador SSE estándar
        const lineas = buffer.split('\n\n');
        buffer = lineas.pop() || '';

        for (const linea of lineas) {
          if (!linea.startsWith('data: ')) continue;
          try {
            const datos = JSON.parse(linea.slice(6).trim()); // slice(6) = quita "data: "

            if (datos.tipo === 'grafico') {
              textoFinal = 'Aquí tienes el análisis visual solicitado:';
              setMensajes(prev => prev.map(m =>
                m.id === idBot ? { ...m, texto: textoFinal, grafico: datos.contenido } : m
              ));

            } else if (datos.tipo === 'texto') {
              textoFinal += datos.contenido;
              setMensajes(prev => prev.map(m =>
                m.id === idBot ? { ...m, texto: m.texto + datos.contenido } : m
              ));
            }
          } catch (_) { /* chunk incompleto, se acumula en buffer */ }
        }
      }

      // Guardamos la respuesta del bot en el historial ref
      historialRef.current = [...historialRef.current, { ...msgBot, texto: textoFinal }];

    } catch (error) {
      console.error('[usePollobot]', error);
      setMensajes(prev => prev.map(m =>
        m.id === idBot
          ? { ...m, texto: '❌ Lo siento, hubo un problema al procesar tu consulta. Inténtalo de nuevo.' }
          : m
      ));
    } finally {
      setCargando(false);
      setIdUltimoBot(null);
    }
  };

  return { mensajes, cargando, idUltimoBot, enviarMensaje, limpiarConversacion };
};