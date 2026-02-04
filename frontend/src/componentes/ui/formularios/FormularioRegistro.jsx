import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

import CampoEntrada from '../inputs/CampoEntrada';
import CampoCheckbox from '../inputs/CampoCheckbox';  

import { registroValidacion } from '../../../utilidades/registroValidacion';

import { Link } from 'react-router-dom';

const FormularioRegistro = ({ alEnviar, estaCargando = false }) => {
  const {
    register, 
    handleSubmit,
    formState: { errors, isValid },
    reset, 
    trigger, 
  } = useForm({
    resolver: yupResolver(registroValidacion),
    mode: 'onChange',
    defaultValues: {
      idTipoDocumento: 1,
    },
  });

  const manejarEnvioFormulario = async (datos) => {
    try {
      await alEnviar(datos);
      await trigger();
    } catch (error) {
    }
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvioFormulario)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoEntrada
          id="nombreUsuario"
          nombre="nombreUsuario"
          etiqueta="Nombres"
          marcadorPosicion="Ingresa tus nombres"
          icono={FaUser}
          registro={register}
          error={errors.nombreUsuario}
        />

        <CampoEntrada
          id="apellidoUsuario"
          nombre="apellidoUsuario"
          etiqueta="Apellidos"
          marcadorPosicion="Ingresa tus apellidos"
          icono={FaUser}
          registro={register}
          error={errors.apellidoUsuario}
        />
      </div>

      <CampoEntrada
        id="correoUsuario"
        nombre="correoUsuario"
        tipo="email"
        etiqueta="Correo Electrónico"
        marcadorPosicion="Ingresa tu correo electrónico"
        icono={FaEnvelope}
        registro={register}
        error={errors.correoUsuario}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoEntrada
          id="claveUsuario"
          nombre="claveUsuario"
          tipo="password"
          etiqueta="Contraseña"
          marcadorPosicion="Crea una contraseña"
          icono={FaLock}
          registro={register}
          error={errors.claveUsuario}
        />

        <CampoEntrada
          id="confirmarClave"
          nombre="confirmarClave"
          tipo="password"
          etiqueta="Confirmar Contraseña"
          marcadorPosicion="Confirma tu contraseña"
          icono={FaLock}
          registro={register}
          error={errors.confirmarClave}
        />
      </div>

      <CampoEntrada
        id="telefonoUsuario"
        nombre="telefonoUsuario"
        tipo="tel"
        etiqueta="Teléfono"
        marcadorPosicion="Ingresa tu número de teléfono"
        icono={FaPhone}
        registro={register}
        error={errors.telefonoUsuario}
      />

      <CampoCheckbox
        id="aceptoTerminos"
        nombre="aceptoTerminos"
        etiqueta={
          <>
            Acepto los{' '}
            <Link to="/terminos-condiciones" className="text-azul-primario hover:underline" >
              Términos y Condiciones
            </Link>{' '}
            y la{' '}
            <Link to="/politicas-privacidad" className="text-azul-primario hover:underline">
                Política de Privacidad
            </Link>
          </>
        }
        registro={register}
        error={errors.aceptoTerminos}
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
              Creando cuenta...
            </div>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioRegistro;