import * as yup from 'yup'; 

export const registroValidacion = yup.object().shape({
  nombresUsuario: yup
    .string() 
    .required('Los nombres son obligatorios') 
    .min(2, 'Los nombres deben tener al menos 2 caracteres') 
    .max(50, 'Los nombres no pueden exceder 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras'),
  
  apellidosUsuario: yup
    .string()
    .required('Los apellidos son obligatorios')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),
  
  correoUsuario: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres'),

  clave: yup
  .string()
  .required('La contraseña es obligatoria')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña no puede exceder 50 caracteres')
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
    .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden'),
  
  telefonoUsuario: yup
    .string()
    .required('El número de teléfono es obligatorio')
    .matches(/^[+]?[\d\s\-()]{8,15}$/, 'Ingresa un número de teléfono válido'), 
  
  aceptoTerminos: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});