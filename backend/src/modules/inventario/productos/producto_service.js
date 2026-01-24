const cloudinary = require('../../../config/cloudinary_config');
const fs = require('fs');

const { validarDatosProducto, validarDatosActualizarProducto } = require('./producto_validacion');

const {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel,
    contarProductosPorIdModel,
    contarProductosNombreV2Model, 
    registraProductoModel,
    actualizarDatosProductoModel
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

    fs.unlinkSync(file.path); 

    const producto = await registraProductoModel(nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria, cloudinaryResult.secure_url, cloudinaryResult.public_id);

    return {
        ok: true,
        mensaje: 'Producto insertado correctamente',
        producto
    };
};

const actualizarDatosProductoService = async (datos, idProducto) => {
    if (idProducto.trim() === "" || isNaN(Number(idProducto))) {
        throw crearError('Producto no valido', 400);
    }
    const productoID = Number(idProducto);

    validarDatosActualizarProducto(datos);

    const { nombreProducto, descripcionProducto, precioProducto, idCategoria} = datos;
    const productosExistentes = await contarProductosPorIdModel(productoID);

    if(productosExistentes === 0){
        throw crearError('El producto especificado no existe', 404)
    }

    const categoriasId = await contarCategoriasPorIdModel(idCategoria);

    if(!categoriasId || categoriasId === 0){
        throw crearError('La categoria especificada no existe', 400);
    }

    const coincidenciasNombre = await contarProductosNombreV2Model(nombreProducto, productoID);
    if(coincidenciasNombre.total_activos > 0){
        throw crearError('Ese nombre de producto ya esta en uso', 400);
    } else if(coincidenciasNombre.total_inactivos > 0) {
        throw crearError('Ese nombre de producto coincide con un producto inactivo. Por favor, reactívelo o use otro nombre.', 400);
    }

    const productoActualizado = await actualizarDatosProductoModel(productoID, nombreProducto, descripcionProducto, precioProducto, idCategoria);

    return {
        ok: true,
        mensaje: 'Producto actualizado correctamente',
        producto: productoActualizado
    }

};

module.exports = {
    agregarProductoService,
    actualizarDatosProductoService
}