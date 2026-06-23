import { useState } from 'react';

export const usePollobot = () => {
  const [mensajes, setMensajes] = useState([
    {
      id: 'welcome',
      rol: 'bot',
      texto: 'Hola 👋 Soy Pollobot, tu asistente del panel. Puedo ayudarte con ventas, stock, reportes o dudas del sistema. ¿En qué puedo ayudarte?',
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [cargando, setCargando] = useState(false);

  // Formatea el historial interno al formato oficial de Gemini que espera tu backend
  const formatearHistorialParaBackend = (listaMensajes) => {
    // Filtramos el de bienvenida si no queremos ensuciar el contexto inicial
    return listaMensajes
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.rol === 'bot' ? 'model' : 'user',
        parts: [{ text: m.texto }],
      }));
  };

  const enviarMensaje = async (textoMensaje) => {
    if (!textoMensaje.trim() || cargando) return;

    const horaActual = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    // 1. Agregar el mensaje del usuario al estado inmediatamente
    const nuevoMensajeUsuario = {
      id: crypto.randomUUID(),
      rol: 'usuario',
      texto: textoMensaje,
      hora: horaActual,
    };

    // Generamos el id para el mensaje del bot que se irá llenando vía stream
    const idMensajeBot = crypto.randomUUID();
    const nuevoMensajeBotPlaceholder = {
      id: idMensajeBot,
      rol: 'bot',
      texto: '', // Empezará vacío
      hora: horaActual,
    };

    const historialActualizado = [...mensajes, nuevoMensajeUsuario];
    setMensajes([...historialActualizado, nuevoMensajeBotPlaceholder]);
    setCargando(true);

    try {
      const historialBackend = formatearHistorialParaBackend(mensajes);

      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensaje: textoMensaje,
          historial: historialBackend,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con Pollobot');

      // 2. Procesar el stream del backend chunk por chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let acumulado = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decodificar el trozo de texto recibido
        const chunk = decoder.decode(value, { stream: true });
        acumulado += chunk;

        // Actualizar progresivamente el contenido del mensaje del bot
        setMensajes((prevMensajes) =>
          prevMensajes.map((m) =>
            m.id === idMensajeBot ? { ...m, texto: acumulado } : m
          )
        );
      }
    } catch (error) {
      console.error('Error streaming Pollobot:', error);
      setMensajes((prevMensajes) =>
        prevMensajes.map((m) =>
          m.id === idMensajeBot
            ? { ...m, texto: 'Lo siento, hubo un problema al procesar tu consulta. Inténtalo de nuevo.' }
            : m
        )
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarConversacion = () => {
    setMensajes([
      {
        id: 'welcome',
        rol: 'bot',
        texto: 'Hola 👋 Soy Pollobot, tu asistente del panel. Puedo ayudarte con ventas, stock, reportes o dudas del sistema. ¿En qué puedo ayudarte?',
        hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return {
    mensajes,
    cargando,
    enviarMensaje,
    limpiarConversacion,
  };
};