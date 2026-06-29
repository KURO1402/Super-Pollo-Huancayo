import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaArrowLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAutenticacionStore } from '../../store/useAutenticacionStore';
import VerificacionCorreo from '../../componentes/VerificacionCorreo';
import { mostrarAlerta } from '../../utilidades/toastUtilidades';
import { ROLES } from '../../constantes/roles';
import { loginUsuario } from '../../servicios/autenticacionServicio';

// ─── Esquemas de validación ───────────────────────────────────────────────────

const schemaCorreo = yup.object({
  correo: yup
    .string()
    .email('Ingresa un correo válido')
    .required('El correo es requerido'),
});

const schemaNuevaClave = yup.object({
  nuevaClave: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La nueva contraseña es requerida'),
  confirmarClave: yup
    .string()
    .oneOf([yup.ref('nuevaClave')], 'Las contraseñas no coinciden')
    .required('Confirma tu nueva contraseña'),
});

// ─── Sub-componente: Paso 1 — Ingresar correo ────────────────────────────────

const PasoCorreo = ({ onSiguiente, estaCargando }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaCorreo) });

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaEnvelope className="text-red-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h2>
        <p className="text-gray-400 text-sm">
          Ingresa tu correo y te enviaremos un código para recuperarla.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSiguiente)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            {...register('correo')}
            className={`w-full px-4 py-3 border rounded-xl text-sm bg-neutral-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors
              ${errors.correo ? 'border-red-500 bg-red-500/10' : 'border-white/10 focus:border-red-600'}`}
          />
          {errors.correo && (
            <p className="mt-1 text-xs text-red-500">{errors.correo.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={estaCargando}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {estaCargando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Enviando código...
            </>
          ) : (
            'Enviar código de verificación'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        ¿Recordaste tu contraseña?{' '}
        <Link to="/inicio-sesion" className="font-medium text-red-500 hover:text-red-400">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

// ─── Sub-componente: Paso 3 — Nueva contraseña ───────────────────────────────

const PasoClave = ({ onGuardar, estaCargando }) => {
  const [verClave, setVerClave] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaNuevaClave) });

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-red-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Crea tu nueva contraseña</h2>
        <p className="text-gray-400 text-sm">Elige una contraseña segura de al menos 8 caracteres.</p>
      </div>

      <form onSubmit={handleSubmit(onGuardar)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={verClave ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              {...register('nuevaClave')}
              className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm bg-neutral-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors
                ${errors.nuevaClave ? 'border-red-500 bg-red-500/10' : 'border-white/10 focus:border-red-600'}`}
            />
            <button
              type="button"
              onClick={() => setVerClave(!verClave)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              tabIndex={-1}
            >
              {verClave ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.nuevaClave && (
            <p className="mt-1 text-xs text-red-500">{errors.nuevaClave.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={verConfirmar ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              {...register('confirmarClave')}
              className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm bg-neutral-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors
                ${errors.confirmarClave ? 'border-red-500 bg-red-500/10' : 'border-white/10 focus:border-red-600'}`}
            />
            <button
              type="button"
              onClick={() => setVerConfirmar(!verConfirmar)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              tabIndex={-1}
            >
              {verConfirmar ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmarClave && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmarClave.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={estaCargando}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {estaCargando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar nueva contraseña'
          )}
        </button>
      </form>
    </div>
  );
};

// ─── Indicador de pasos ───────────────────────────────────────────────────────

const IndicadorPasos = ({ pasoActual }) => {
  const pasos = ['Correo', 'Verificación', 'Nueva clave'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {pasos.map((etiqueta, i) => {
        const num = i + 1;
        const activo = num === pasoActual;
        const completado = num < pasoActual;
        return (
          <div key={num} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${completado ? 'bg-green-500 text-white' : activo ? 'bg-red-600 text-white' : 'bg-neutral-800 text-gray-500'}`}
              >
                {completado ? '✓' : num}
              </div>
              <span className={`text-xs mt-1 font-medium ${activo ? 'text-red-500' : 'text-gray-500'}`}>
                {etiqueta}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div className={`w-10 h-0.5 mb-4 transition-colors ${completado ? 'bg-green-400' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────

const RecuperarClave = () => {
  const { verificarCorreo, validarCodigo, restaurarClave, carga, error, limpiarError } =
    useAutenticacionStore();
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    if (error) {
      mostrarAlerta.error(error);
      const timer = setTimeout(() => limpiarError(), 200);
      return () => clearTimeout(timer);
    }
  }, [error, limpiarError]);

  // Paso 1 → enviar código con tipoVerificacion: 2
  const handleEnviarCodigo = async ({ correo: correoIngresado }) => {
    try {
      await verificarCorreo(correoIngresado, 2);
      setCorreo(correoIngresado);
      setPaso(2);
      mostrarAlerta.info('Código de verificación enviado a tu correo');
    } catch {
      // el error ya se muestra via useEffect
    }
  };

  // Paso 2 → verificar código con tipoVerificacion: 2
  const handleVerificarCodigo = async (codigoIngresado) => {
    try {
      await validarCodigo({ correo, codigo: codigoIngresado, tipoVerificacion: 2 });
      setPaso(3);
    } catch {
      // el error ya se muestra via useEffect
    }
  };

  const handleReenviarCodigo = async () => {
    try {
      await verificarCorreo(correo, 2);
      mostrarAlerta.info('Nuevo código enviado a tu correo');
    } catch {
      // el error ya se muestra via useEffect
    }
  };

  // Paso 3 → restaurar contraseña e iniciar sesión automáticamente
  const handleGuardarClave = async ({ nuevaClave }) => {
    try {
        await restaurarClave(correo, nuevaClave);
        // Llamar directo al servicio, no al store
        const respuesta = await loginUsuario({ email: correo, clave: nuevaClave });
        // Setear manualmente el estado en el store
        useAutenticacionStore.setState({
            usuario: respuesta.usuario,
            accessToken: respuesta.accessToken,
        });
        mostrarAlerta.exito('¡Contraseña actualizada correctamente!');
        const usuario = respuesta.usuario;
        if (usuario.id_rol === ROLES.ADMIN) navigate('/panel-admin', { replace: true });
        else if (usuario.id_rol === ROLES.USUARIO) navigate('/usuario', { replace: true });
        else navigate('/inicio-sesion', { replace: true });
    } catch {
        // el error ya se muestra via useEffect
    }
};

  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8 fondo-login-registro">
      <div
        className={`w-full rounded-2xl shadow-2xl overflow-hidden border border-white/5 transition-all duration-300
          ${paso === 1 ? 'max-w-4xl' : 'max-w-lg'}`}
      >
        <div className="md:flex relative">

          {/* Panel lateral — solo en paso 1 */}
          {paso === 1 && (
            <div className="hidden md:block md:w-2/5 bg-black/10 backdrop-blur-lg p-12 text-white relative z-10 overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 border-r border-red-400 bg-linear-to-br from-[#0a111e] via-[#680b0b] to-[#dd1717] rounded-r-[100%_51%] shadow-[3px_0_4px_0_#cc0000,inset_-3px_0_4px_0_#cc0000] pointer-events-none z-0 overflow-hidden"></div>
              <div className="flex flex-col h-full justify-center relative z-20">
                <div className="w-16 h-1 bg-yellow-500 mb-6 rounded-full"></div>
                <h2 className="text-3xl font-bold mb-6 leading-tight">Recupera tu acceso</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Te enviaremos un código de verificación a tu correo para que puedas crear
                  una nueva contraseña de forma segura.
                </p>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <div className={`w-full ${paso === 1 ? 'md:w-3/5' : ''} py-10 px-8 relative z-10 bg-black/10 backdrop-blur-md`}>

            {/* Botón volver (pasos 2 y 3) */}
            {(paso === 2 || paso === 3) && (
              <button
                onClick={() => setPaso(paso - 1)}
                className="text-red-500 hover:text-red-400 font-medium mb-6 flex items-center gap-2 text-sm"
              >
                <FaArrowLeft />
                Volver
              </button>
            )}

            {/* Indicador de pasos */}
            <IndicadorPasos pasoActual={paso} />

            {/* Renderizado por paso */}
            {paso === 1 && (
              <PasoCorreo onSiguiente={handleEnviarCodigo} estaCargando={carga} />
            )}

            {paso === 2 && (
              <VerificacionCorreo
                correo={correo}
                onCodigoValidado={handleVerificarCodigo}
                onReenviarCodigo={handleReenviarCodigo}
                estaCargando={carga}
              />
            )}

            {paso === 3 && (
              <PasoClave onGuardar={handleGuardarClave} estaCargando={carga} />
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default RecuperarClave;