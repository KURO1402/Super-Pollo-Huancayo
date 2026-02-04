export const ROLES = {
  USUARIO: 1, // anterior era superdaministrador 
  COLABORADOR: 2, // antes era administrador
  ADMINISTRADOR: 3, // antes era usuario
};

export const NOMBRES_ROLES = {
  [ROLES.USUARIO]: 'usuario',
  [ROLES.COLABORADOR]: 'colaborador',
  [ROLES.ADMINISTRADOR]: 'administrador',
};

export const PERMISOS = {

  [ROLES.ADMINISTRADOR]: {

    accesoPanelAdmin: true,
    dashboard: true,
    usuarios: true,
    
    ventas: true,
    generarVenta: true,
    historialVentas: true,
    
    stock: true,
    stockInsumos: true,
    historialEntradas: true,
    historialSalidas: true,
    gestionProductos: true,
    
    caja: true,
    cajaActual: true,
    historialCajas: true,
    
    reservas: true,
    calendarioReservas: true,
    historialReservas: true,
    
    perfil: true,
  },

  [ROLES.COLABORADOR]: {

    accesoPanelAdmin: true,
    dashboard: false,
    usuarios: false,
    
    ventas: true,
    generarVenta: true,
    historialVentas: true,
    
    stock: true,
    stockInsumos: true,
    historialEntradas: true,
    historialSalidas: true,
    gestionProductos: true,
    
    caja: true,
    cajaActual: true,
    historialCajas: true,
    
    reservas: true,
    calendarioReservas: true,
    historialReservas: true,
    
    perfil: true,
    reportes: false,
    configuracion: false,
  },

  [ROLES.USUARIO]: {

    accesoPanelAdmin: false,
    dashboard: false,
    usuarios: false,
    
    accesoAreaUsuario: true,
    hacerReservas: true,
    verMisReservas: true,
    modificarReservas: true,
    cancelarReservas: true,
    
    perfil: true,
    reportes: false,
    configuracion: false,
  },
};

export const RUTAS_REDIRECCION = {
  [ROLES.USUARIO]: '/usuario', 
  [ROLES.COLABORADOR]: '/admin/generar-venta',
  [ROLES.ADMINISTRADOR]: '/admin',
};


export const tienePermiso = (id_rol, permiso) => {
  return PERMISOS[id_rol]?.[permiso] || false;
};

export const obtenerNombreRol = (id_rol) => {
  return NOMBRES_ROLES[id_rol] || 'Desconocido';
};

export const obtenerRutaRedireccion = (id_rol) => {
  return RUTAS_REDIRECCION[id_rol] || '/';
};

export const puedeAccederPanelAdmin = (id_rol) => {
  return tienePermiso(id_rol, 'accesoPanelAdmin');
};

export const puedeAccederAreaUsuario = (id_rol) => {
  return tienePermiso(id_rol, 'accesoAreaUsuario');
};