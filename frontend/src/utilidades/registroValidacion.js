import * as yup from 'yup'; 

export const registroValidacion = yup.object().shape({
  nombreUsuario: yup
    .string() 
    .required('Los nombres son obligatorios') 
    .min(2, 'Debe tener mínimo 2 caracteres') 
    .max(50, 'No debe exceder 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo pueden contener letras'),
  
  apellidoUsuario: yup
    .string()
    .required('Los apellidos son obligatorios')
    .min(2, 'Deben tener al menos 2 caracteres')
    .max(50, 'No pueden exceder 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo pueden contener letras'),
  
  correoUsuario: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres'),

  claveUsuario: yup
  .string()
  .required('La contraseña es obligatoria')
  .min(8, 'Debe tener al menos 8 caracteres')
  .max(50, 'No puede exceder 50 caracteres')
  .test(
    'clave segura', 
    'La contraseña no cumple con los requisitos mínimos',
    function (value) {
      const errors = [];
      if (!value) return false; 
      if (!/[a-z]/.test(value)) {
        errors.push('Debe incluir al menos una letra minúscula.');
      } 
      if (!/[A-Z]/.test(value)) {
        errors.push('Debe incluir al menos una letra mayúscula.');
      } 
      if (!/\d/.test(value)) {
        errors.push('Debe incluir al menos un número.');
      }
      if (errors.length > 0) {
        return this.createError({ message: errors.join(' ') });
      }
      return true;
    }
  ),
  
  confirmarClave: yup
    .string()
    .required('Debes confirmar tu contraseña')
    .oneOf([yup.ref('claveUsuario')], 'Las contraseñas no coinciden'),
  
  telefonoUsuario: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[+]?[\d\s\-()]{8,15}$/, { 
      message: 'Ingresa un número de teléfono válido',
      excludeEmptyString: true,
    }), 
  
  aceptoTerminos: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});