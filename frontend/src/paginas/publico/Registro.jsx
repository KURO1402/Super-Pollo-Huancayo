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
      await verificarCorreo(formularioData.correoUsuario);
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
        codigo: codigo
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
      await verificarCorreo(correoVerificacion);
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
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${paso === 2 ? 'max-w-2xl' : ''}`}>
        <div className="md:flex">
          {paso === 1 && (
            <div className="hidden md:block md:w-2/5 bg-azul-primario p-12 text-white">
              <div className="flex flex-col h-full justify-center">
                <h2 className="text-3xl font-bold mb-6">
                  Forma parte de nuestro increíble equipo y diviértete con nosotros.
                </h2>
                <p className="text-gray-300">
                  Únete a nuestra comunidad y disfruta de los beneficios de ser parte de Super Pollo.
                </p>
                <div className="mt-10">
                  <div className="w-24 h-2 bg-yellow-400 mb-4"></div>
                </div>
              </div>
            </div>
          )}
          
          <div className={`w-full ${paso === 1 ? 'md:w-3/5' : 'md:w-full'} py-10 px-8`}>
            {paso === 1 ? (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                  <p className="text-gray-600">Completa tus datos para registrarte</p>
                </div>
                
                <FormularioRegistro
                  alEnviar={handleRegistroSubmit}
                  estaCargando={carga}
                />
                
                <p className="mt-6 text-center text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/inicio-sesion" className="font-medium text-azul-primario hover:text-azul-secundario">
                    Inicia sesión aquí
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <button
                    onClick={handleVolverAlFormulario}
                    className="text-azul-primario hover:text-azul-secundario font-medium mb-4 flex items-center justify-center mx-auto"
                  >
                    <FaArrowLeft className="pr-2 text-2xl"/>
                     Volver al formulario
                  </button>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificación de Correo</h2>
                  <p className="text-gray-600">Completa la verificación para finalizar tu registro</p>
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