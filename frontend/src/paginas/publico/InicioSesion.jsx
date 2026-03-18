import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { useEffect } from 'react';
import { useAutenticacionStore } from '../../store/useAutenticacionStore';
import FormularioInicioSesion from '../../componentes/ui/formularios/FormularioInicioSesion';
import { mostrarAlerta } from '../../utilidades/toastUtilidades';
import { obtenerRutaRedireccion, ROLES } from '../../constantes/roles';

const InicioSesion = ()=> {
  const { login, carga, error, limpiarError, usuario } = useAutenticacionStore(); 
  const navigate = useNavigate(); 
  const location = useLocation();

  const manejarEnvioInicioSesion = async (datosFormulario) => {
    const usuarioLogueado = await login(datosFormulario);
    if (usuarioLogueado) {
        const rutaDestino = obtenerRutaRedireccion(usuarioLogueado.id_rol);
        const from = location.state?.from?.pathname;

        mostrarAlerta.exito('¡Bienvenido de nuevo!');

        const rutasAdmin = ['/admin/usuarios', '/admin/categorias-productos', '/admin/tipos-documento', '/admin/medios-pago', '/admin/tipos-comprobante'];
        const esRutaRestringida = rutasAdmin.some(ruta => from?.startsWith(ruta));
        const esAdmin = usuarioLogueado.id_rol === ROLES.ADMINISTRADOR;

        if (from && from !== '/inicio-sesion' && (!esRutaRestringida || esAdmin)) {
            navigate(from, { replace: true });
        } else {
            navigate(rutaDestino, { replace: true });
        }
    }
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
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-2/5 bg-azul-primario p-12 text-white">
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold mb-6">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-300">
                Accede a tu cuenta para disfrutar de todos los beneficios de Super Pollo.
              </p>
              <div className="mt-10">
                <div className="w-24 h-2 bg-yellow-400 mb-4"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-3/5 py-10 px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa a tu cuenta</p>
            </div>
            
            <FormularioInicioSesion 
              alEnviar={manejarEnvioInicioSesion} 
              estaCargando={carga}
            />
            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="font-medium text-azul-primario hover:text-azul-secundario">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InicioSesion;