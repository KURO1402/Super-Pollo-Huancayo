import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import FormularioRegistro from "../../componentes/ui/formularios/FormularioRegistro";
import VerificacionCorreo from "../../componentes/VerificacionCorreo";
import { mostrarAlerta } from "../../utilidades/toastUtilidades";
import { ROLES } from "../../constantes/roles";

const Registro = () => {
  const registrar = useAutenticacionStore((state) => state.registrar); 
  const carga = useAutenticacionStore((state) => state.carga);
  const error = useAutenticacionStore((state) => state.error);
  const limpiarError = useAutenticacionStore((state) => state.limpiarError);
  const verificarCorreo = useAutenticacionStore((state) => state.verificarCorreo);
  const validarCodigo = useAutenticacionStore((state) => state.validarCodigo);
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1);
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [correoVerificacion, setCorreoVerificacion] = useState('');
  const handleRegistroSubmit = async (formularioData) => {
    try {
      await verificarCorreo(formularioData.correoUsuario, 1);
      setDatosTemporales(formularioData);
      setCorreoVerificacion(formularioData.correoUsuario);
      setPaso(2);

      mostrarAlerta.info('Código de verificación enviado a tu correo');
    } catch (error) {
    }
  };
  const handleCodigoValidado = async (codigo) => {
    try {
      await validarCodigo({
        correo: correoVerificacion,
        codigo: codigo,
        tipoVerificacion: 1,
      });
      const usuarioRegistrado = await registrar(datosTemporales);
      
      if (usuarioRegistrado) {
        mostrarAlerta.exito('¡Cuenta verificada y creada exitosamente!');
        if (usuarioRegistrado.id_rol === ROLES.USUARIO) {
          navigate("/usuario", { replace: true });
        }
      }
    } catch (error) {
    }
  };

  const handleReenviarCodigo = async () => {
    try {
      await verificarCorreo(correoVerificacion, 1);
      mostrarAlerta.info('Nuevo código enviado a tu correo');
    } catch (error) {
    }
  };

  const handleVolverAlFormulario = () => {
    setPaso(1);
    setDatosTemporales(null);
    setCorreoVerificacion('');
  };

  useEffect(() => {
      if (error) { 
        mostrarAlerta.error(error); 
        const timer = setTimeout(() => limpiarError(), 200);
        return () => clearTimeout(timer); 
      }
    }, [error, limpiarError]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 fondo-login-registro">
      <div className={`max-w-4xl w-full bg-black/10 shadow-2xl backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${paso === 2 ? 'max-w-2xl' : ''}`}>
      <div className="md:flex relative">
        {paso === 1 && (
          <div className="hidden md:block md:w-2/5 bg-black/10 shadow-2xl backdrop-blur-md p-12 text-white relative z-10 overflow-hidden">

            <div className="absolute top-0 bottom-0 left-0 right-[-40px] bg-linear-to-br from-[#0a111e] via-[#680b0b] to-[#dd1717] border-r-0.5 border-red-500/40 pointer-events-none z-0"></div>

            <div className="flex flex-col h-full justify-center relative z-20">
              <div className="w-16 h-1 bg-yellow-500 mb-6 rounded-full"></div>

              <h2 className="text-3xl font-bold mb-6 leading-tight">
                Forma parte de nuestro increíble equipo y diviértete con nosotros.
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Únete a nuestra comunidad y disfruta de los beneficios de ser parte de Super Pollo.
              </p>
            </div>
          </div>
        )}

        <div className={`w-full ${paso === 1 ? 'md:w-3/5' : 'md:w-full'} py-10 px-8 relative z-10 bg-black/10 shadow-2xl backdrop-blur-md`}>
          {paso === 1 ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
                <p className="text-gray-400 text-sm">Completa tus datos para registrarte</p>
                <div className="w-12 h-1 bg-red-600 mx-auto mt-3 rounded-full"></div>
              </div>

              <FormularioRegistro
                alEnviar={handleRegistroSubmit}
                estaCargando={carga}
              />

              <p className="mt-6 text-center text-sm text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/inicio-sesion" className="font-medium text-red-500 hover:text-red-400">
                  Inicia sesión aquí
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <button
                  onClick={handleVolverAlFormulario}
                  className="text-red-500 hover:text-red-400 font-medium mb-4 flex items-center justify-center mx-auto"
                >
                  <FaArrowLeft className="pr-2 text-2xl"/>
                  Volver al formulario
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Verificación de Correo</h2>
                <p className="text-gray-400 text-sm">Completa la verificación para finalizar tu registro</p>
              </div>

              <VerificacionCorreo
                correo={correoVerificacion}
                onCodigoValidado={handleCodigoValidado}
                onReenviarCodigo={handleReenviarCodigo}
                estaCargando={carga}
              />
            </>
          )}
        </div>
      </div>
    </div>
    </section>
  );
};

export default Registro;