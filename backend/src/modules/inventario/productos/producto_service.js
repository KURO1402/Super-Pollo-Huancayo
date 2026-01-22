const cloudinary = require('../../../config/cloudinary_config');
const fs = require('fs');

const { validarDatosProducto } = require('./producto_validacion');

const {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel, 
    registraProductoModel
} = require('./producto_model');

const crearError = require('../../../utilidades/crear_error');

const agregarProductoService = async (datos, file) => {
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

    if(usaInsumos === 1){
        insumos
    }

    let cloudinaryResult;
    try {
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw Object.assign(new Error("No se pudo subir la imagen a Cloudinary"), { status: 500 });
    }

    const producto = await registraProductoModel(nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria, cloudinaryResult.secure_url, cloudinaryResult.public_id);
    fs.unlinkSync(file.path); 

    return {
        ok: true,
        mensaje: 'Producto insertado correctamente',
        producto
    };
};


module.exports = {
    agregarProductoService
}