const { validarDatosProducto } = require('./producto_validacion');

const agregarProductoService = async (datos) => {
    validarDatosProducto(datos);
    return datos;
};


module.exports = {
    agregarProductoService
}