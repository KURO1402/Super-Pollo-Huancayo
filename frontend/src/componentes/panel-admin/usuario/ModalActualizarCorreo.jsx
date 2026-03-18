import { useState, useEffect, useRef } from "react";
import { FiMail, FiLock, FiShield, FiArrowLeft } from "react-icons/fi";
import { actualizarCorreoUsuarioServicio } from "../../../servicios/usuariosServicios";
import { generarCodigoVerificacion, validarCodigoVerificacion } from "../../../servicios/autenticacionServicio";
import { BotonSimple } from "../../ui/botones/BotonSimple";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const PASO_FORMULARIO = 1;
const PASO_CODIGO     = 2;
const TIEMPO_REENVIO  = 5 * 60;

const ModalActualizarCorreo = ({ correoActual, onClose, onCorreoActualizado }) => {
  const [paso, setPaso]       = useState(PASO_FORMULARIO);
  const [formData, setFormData] = useState({ nuevoCorreo: "", clave: "" });
  const [codigo, setCodigo]   = useState("");
  const [cargando, setCargando] = useState(false);
  const [contador, setContador] = useState(TIEMPO_REENVIO);
  const intervaloRef = useRef(null);

  const iniciarContador = () => {
    setContador(TIEMPO_REENVIO);
    clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(intervaloRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(intervaloRef.current);
  }, []);

  const formatearTiempo = (segundos) => {
    const m = Math.floor(segundos / 60).toString().padStart(2, "0");
    const s = (segundos % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    if (!formData.nuevoCorreo || !formData.clave) return;

    setCargando(true);
    try {
      await generarCodigoVerificacion(formData.nuevoCorreo);
      mostrarAlerta.exito("Código enviado al nuevo correo");
      setPaso(PASO_CODIGO);
      iniciarContador();
    } catch (error) {
      mostrarAlerta.error(
        error.response?.data?.mensaje || error.message || "Error al enviar el código"
      );
    } finally {
      setCargando(false);
    }
  };

  const handleVerificarYActualizar = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setCargando(true);
    try {
      await validarCodigoVerificacion({
        correo: formData.nuevoCorreo,
        codigo: codigo.trim(),
      });

      await actualizarCorreoUsuarioServicio({
        nuevoCorreo: formData.nuevoCorreo,
        clave: formData.clave,
      });

      clearInterval(intervaloRef.current);
      mostrarAlerta.exito("Correo actualizado correctamente");
      if (onCorreoActualizado) onCorreoActualizado(formData.nuevoCorreo);
      onClose();
    } catch (error) {
      mostrarAlerta.error(
        error.response?.data?.mensaje || error.message || "Código incorrecto o expirado"
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setCargando(true);
    try {
      await generarCodigoVerificacion(formData.nuevoCorreo);
      mostrarAlerta.exito("Código reenviado correctamente");
      iniciarContador();
    } catch (error) {
      mostrarAlerta.error(
        error.response?.data?.mensaje || error.message || "Error al reenviar el código"
      );
    } finally {
      setCargando(false);
    }
  };

  const handleVolver = () => {
    clearInterval(intervaloRef.current);
    setPaso(PASO_FORMULARIO);
    setCodigo("");
  };

  return (
    <div className="space-y-5">
      {paso === PASO_FORMULARIO && (
        <form onSubmit={handleEnviarCodigo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Correo actual
            </label>
            <div className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">{correoActual}</p>
            </div>
          </div>

          <div>
            <label htmlFor="nuevoCorreo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nuevo correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="nuevoCorreo"
                name="nuevoCorreo"
                value={formData.nuevoCorreo}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="nuevo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="clave" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Contraseña actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                id="clave"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña actual"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Se enviará un código de verificación al nuevo correo para confirmar el cambio.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <BotonSimple funcion={onClose} etiqueta="Cancelar" variante="secundario" disabled={cargando} />
            <BotonSimple
              tipo="submit"
              etiqueta={cargando ? "Enviando..." : "Enviar código"}
              variante="primario"
              disabled={cargando || !formData.nuevoCorreo || !formData.clave}
            />
          </div>
        </form>
      )}

      {paso === PASO_CODIGO && (
        <form onSubmit={handleVerificarYActualizar} className="space-y-4">
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <FiShield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Verifica tu nuevo correo
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa el código que enviamos a
            </p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">
              {formData.nuevoCorreo}
            </p>
          </div>

          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Código de verificación
            </label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl font-mono tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="······"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs">
            {contador > 0 ? (
              <>
                <span className="text-gray-400 dark:text-gray-500">Reenviar código en</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  {formatearTiempo(contador)}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400 dark:text-gray-500">¿No recibiste el código?</span>
                <button
                  type="button"
                  onClick={handleReenviarCodigo}
                  disabled={cargando}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reenviar
                </button>
              </>
            )}
          </div>

          <div className="flex justify-between items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleVolver}
              disabled={cargando}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <FiArrowLeft size={15} />
              Volver
            </button>
            <div className="flex gap-3">
              <BotonSimple funcion={onClose} etiqueta="Cancelar" variante="secundario" disabled={cargando} />
              <BotonSimple
                tipo="submit"
                etiqueta={cargando ? "Verificando..." : "Confirmar"}
                variante="primario"
                disabled={cargando || codigo.length < 6}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModalActualizarCorreo;