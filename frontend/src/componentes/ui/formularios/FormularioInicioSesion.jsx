import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEnvelope, FaLock } from 'react-icons/fa';

import CampoEntrada from '../inputs/CampoEntrada';

import { InicioSesionValidacion } from '../../../utilidades/InicioSesionValidacion';

const FormularioInicioSesion = ({ alEnviar, estaCargando = false }) => {  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(InicioSesionValidacion),
    mode: 'onChange'
  });

  const manejarEnvioFormulario = async (datos) => {
    try {
      await alEnviar(datos);
      reset(); 
    } catch (error) {
    }
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvioFormulario)} className="space-y-6">
      <CampoEntrada
        id="email"
        nombre="email" 
        tipo="email"
        etiqueta="Correo Electrónico"
        marcadorPosicion="Ingresa tu correo electrónico"
        icono={FaEnvelope}
        registro={register}
        error={errors.email}
      />
      
      <CampoEntrada
        id="clave"
        nombre="clave"
        tipo="password"
        etiqueta="Contraseña"
        marcadorPosicion="Ingresa tu contraseña"
        icono={FaLock}
        registro={register}
        error={errors.clave}
      />
      
      <div>
        <button
          type="submit"
          disabled={!isValid || estaCargando} 
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
            ${isValid && !estaCargando 
              ? 'bg-azul-primario hover:bg-azul-secundario text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-primario
          `}
        >
          {estaCargando ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Iniciando sesión...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioInicioSesion;