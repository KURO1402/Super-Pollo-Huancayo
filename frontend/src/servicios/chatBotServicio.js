// chatBotServicio.js
import { useAutenticacionStore } from '../store/useAutenticacionStore';
import API from './axiosConfiguracion';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const obtenerAccessToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    return JSON.parse(authStorage)?.state?.accessToken || null;
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

export const leerStreamEstructurado = async (respuesta, onChunk) => {
  const lector = respuesta.body.getReader();
  const decodificador = new TextDecoder('utf-8');

  let buffer = '';
  let textoFinal = '';
  let graficoFinal = null;

  while (true) {
    const { done, value } = await lector.read();
    if (done) break;

    buffer += decodificador.decode(value, { stream: true });

    const lineas = buffer.split('\n\n');
    buffer = lineas.pop() || ''; 

    for (const linea of lineas) {
      const lineaLimpia = linea.trim();
      if (!lineaLimpia.startsWith('data: ')) continue;

      try {
        const datos = JSON.parse(lineaLimpia.slice(6).trim());

        if (datos.tipo === 'grafico') {
          textoFinal = 'Aquí tienes el análisis visual solicitado:';
          graficoFinal = datos.contenido;
        } else if (datos.tipo === 'texto') {
          if (textoFinal !== 'Aquí tienes el análisis visual solicitado:') {
            textoFinal += datos.contenido;
          }
        }

        if (onChunk) {
          onChunk(textoFinal, graficoFinal);
        }
      } catch (_) {
      }
    }
  }

  return { texto: textoFinal, grafico: graficoFinal };
};

export const enviarMensajePollobot = async (mensaje, historial = [], onChunk) => {
  let accessToken = obtenerAccessToken();
  let respuesta = await hacerPeticionChat(mensaje, historial, accessToken);

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
    } catch {}
    throw new Error(mensajeError);
  }

  return await leerStreamEstructurado(respuesta, onChunk);
};