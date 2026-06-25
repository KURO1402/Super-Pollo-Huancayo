import { useAutenticacionStore } from '../store/useAutenticacionStore';
import API from './axiosConfiguracion';


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const obtenerAccessToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const parsed = JSON.parse(authStorage);
    return parsed?.state?.accessToken || null;
  } catch {
    return null;
  }
};

const hacerPeticionChat = (mensaje, historial, token) =>
  fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ mensaje, historial }),
  });

const leerStreamCompleto = async (respuesta) => {
  const lector = respuesta.body.getReader();
  const decodificador = new TextDecoder('utf-8');

  let buffer = '';
  let textoAcumulado = '';
  let grafico = null;

  while (true) {
    const { done, value } = await lector.read();
    if (done) break;

    buffer += decodificador.decode(value, { stream: true });

    // Los eventos SSE vienen separados por doble salto de línea
    const eventos = buffer.split('\n\n');
    buffer = eventos.pop(); // lo último puede estar incompleto, se guarda para la próxima vuelta

    for (const eventoCrudo of eventos) {
      const linea = eventoCrudo.trim();
      if (!linea.startsWith('data:')) continue;

      const jsonTexto = linea.slice(5).trim(); // quita el prefijo "data:"
      if (!jsonTexto) continue;

      try {
        const evento = JSON.parse(jsonTexto);
        if (evento.tipo === 'texto') {
          textoAcumulado += evento.contenido;
        } else if (evento.tipo === 'grafico') {
          grafico = evento.contenido;
        }
      } catch {
        // línea SSE incompleta o corrupta — se ignora
      }
    }
  }

  return { texto: textoAcumulado, grafico };
};

/**
 * Envía un mensaje al asistente Pollobot y devuelve la respuesta
 * completa una vez que el stream SSE termina (sin efecto de
 * "escribiendo" — el mensaje se entrega ya armado).
 *
 * @param {string} mensaje - Mensaje del usuario
 * @param {Array} historial - Historial en formato Gemini: [{ role, parts: [{ text }] }]
 * @returns {Promise<{ texto: string, grafico: object|null }>}
 */
export const enviarMensajePollobot = async (mensaje, historial = []) => {
  let accessToken = obtenerAccessToken();
  let respuesta = await hacerPeticionChat(mensaje, historial, accessToken);

  // ── Token expirado: renovar y reintentar UNA sola vez ──────────────────
  if (respuesta.status === 401 || respuesta.status === 403) {
    try {
      const refreshResponse = await API.post('/auth/renovar-token');
      const nuevoToken = refreshResponse.data.accessToken;
      useAutenticacionStore.getState().setAccessToken(nuevoToken);

      respuesta = await hacerPeticionChat(mensaje, historial, nuevoToken);
    } catch {
      useAutenticacionStore.getState().logout();
      window.location.href = '/inicio-sesion';
      throw new Error('Tu sesión expiró. Por favor inicia sesión de nuevo.');
    }
  }

  if (!respuesta.ok) {
    let mensajeError = 'Error al conectar con el asistente.';
    try {
      const data = await respuesta.json();
      mensajeError = data.error || data.mensaje || mensajeError;
    } catch {
      // si no se pudo parsear, se usa el mensaje genérico
    }
    const error = new Error(mensajeError);
    error.status = respuesta.status;
    throw error;
  }

  return leerStreamCompleto(respuesta);
};