import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAutenticacionStore } from '../../store/useAutenticacionStore';
import FormularioInicioSesion from '../../componentes/ui/formularios/FormularioInicioSesion';
import mostrarAlerta from '../../utilidades/toastUtilidades';
import { obtenerRutaRedireccion, ROLES } from '../../constantes/roles';
import ModalSesionExpirada from '../../componentes/ui/modal/ModalSesionExpirada';


const InicioSesion = () => {

  const { login, carga, error } = useAutenticacionStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarModalExpirada, setMostrarModalExpirada] = useState(
    location.state?.sesionExpirada === true
  );

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
    } else {
      throw new Error(error || 'Credenciales incorrectas');
    }
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8 fondo-login-registro"
    >
      <div className="max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        <div className="md:flex relative">

          {/* Contenedor Izquierdo */}
          <div className="hidden md:block md:w-2/5 bg-black/10 backdrop-blur-lg p-12 text-white relative z-10 overflow-hidden"> 
           <div className="absolute top-0 bottom-0 left-0 right-0 border-r border-red-400 bg-linear-to-br from-[#0a111e] via-[#680b0b] to-[#dd1717] rounded-r-[100%_51%] shadow-[3px_0_4px_0_#cc0000,inset_-3px_0_4px_0_#cc0000] pointer-events-none z-0 overflow-hidden"></div>
           <div className="flex flex-col h-full justify-center relative z-20">
              <div className="w-16 h-1 bg-yellow-500 mb-6 rounded-full"></div>

              <h2 className="text-3xl font-bold mb-6 leading-tight">
                Bienvenido de<br />
                <span className="text-red-500">vuelta</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Accede a tu cuenta para disfrutar de todos los beneficios de Super Pollo.
              </p>
            </div>
          </div>

          {/* Contenedor Derecho (Formulario) */}
          <div className="w-full md:w-3/5 py-12 px-8 relative z-10 bg-black/10 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-1">Iniciar Sesión</h2>
              <p className="text-gray-400 text-sm">Ingresa a tu cuenta</p>
              <div className="w-12 h-1 bg-red-600 mx-auto mt-3 rounded-full"></div>
            </div>

            <FormularioInicioSesion
              alEnviar={manejarEnvioInicioSesion}
              estaCargando={carga}
            />

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs text-gray-500">o</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <p className="text-center text-sm text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="font-medium text-red-500 hover:text-red-400">
                Regístrate aquí
              </Link>
            </p>
          </div>

        </div>
      </div>

      <ModalSesionExpirada
        visible={mostrarModalExpirada}
        onCerrar={() => setMostrarModalExpirada(false)}
      />
    </section>
  );
};

export default InicioSesion;