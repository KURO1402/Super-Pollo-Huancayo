const { validarDatosProducto } = require('./producto_validacion');

const {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel
} = require('./producto_model');

const crearError = require('../../../utilidades/crear_error');

const agregarProductoService = async (datos) => {
    validarDatosProducto(datos);
    const { nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria } = datos;
    const coincidenciasNombre = await contarProductosNombreActInaModel(nombreProducto);

    if (coincidenciasNombre.total_activos > 0) {
        throw crearError('El nombre de producto ya está en uso', 400);
    } else if (coincidenciasNombre.total_inactivos > 0) {
        throw crearError('El nombre de producto coincide con un producto inactivo. Por favor, reactívelo o use otro nombre.', 409);
    };

    const categoriasId = await contarCategoriasPorIdModel(idCategoria);

    if(!categoriasId || categoriasId === 0){
        throw crearError('La categoria especificada no existe', 400);
    }

    

    return datos;
};


module.exports = {
    agregarProductoService
}