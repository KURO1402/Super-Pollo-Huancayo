export const ROLES = {
  SUPERADMIN: 1,
  ADMIN: 2,
  USUARIO: 3,
};

export const NOMBRES_ROLES = {
  [ROLES.SUPERADMIN]: 'Super Administrador',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.USUARIO]: 'Usuario',
};

export const PERMISOS = {

  [ROLES.SUPERADMIN]: {

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

  [ROLES.ADMIN]: {

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
  [ROLES.SUPERADMIN]: '/admin',
  [ROLES.ADMIN]: '/admin/generar-venta',
  [ROLES.USUARIO]: '/usuario',
};


export const tienePermiso = (idRol, permiso) => {
  return PERMISOS[idRol]?.[permiso] || false;
};

export const obtenerNombreRol = (idRol) => {
  return NOMBRES_ROLES[idRol] || 'Desconocido';
};

export const obtenerRutaRedireccion = (idRol) => {
  return RUTAS_REDIRECCION[idRol] || '/';
};

export const puedeAccederPanelAdmin = (idRol) => {
  return tienePermiso(idRol, 'accesoPanelAdmin');
};

export const puedeAccederAreaUsuario = (idRol) => {
  return tienePermiso(idRol, 'accesoAreaUsuario');
};