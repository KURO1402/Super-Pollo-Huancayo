import * as yup from 'yup';

export const InicioSesionValidacion = yup.object().shape({

  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),

  clave: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(1, 'La contraseña es obligatoria')
});