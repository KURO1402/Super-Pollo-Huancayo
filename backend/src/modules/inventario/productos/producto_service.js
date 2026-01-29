const cloudinary = require('../../../config/cloudinary_config');
const fs = require('fs');

const { validarDatosProducto, validarDatosActualizarProducto } = require('./producto_validacion');

const {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel,
    contarProductosPorIdModel,
    contarProductosDeshabilitadosPorIdModel,
    contarProductosNombreV2Model,
    contarInsumoProductoModel,
    contarImagenProductoPorIdModel,
    obtenerPublicIdPorIdImagenModel,
    registraProductoModel,
    actualizarDatosProductoModel,
    agregarCantidadInsumoProductoModel,
    actualizarCantidadInsumoProductoModel,
    eliminarCantidadInsumoProductoModel,
    actualizarEstadoProductoModel,
    insertarImagenProductoModel,
    actualizarImagenProductoModel
} = require('./producto_model');

const { contarInsumosPorIdModel } = require('../insumos/insumos_model');

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
        throw crearError('No se pudo subir la imagen a Cloudinary', 500);
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

const agregarCantidadInsumoProductoService = async (idProducto, datos) => {
    if (idProducto.trim() === "" || isNaN(Number(idProducto))) {
        throw crearError('Producto no valido', 400);
    }
    const productoID = Number(idProducto);
    if(!datos || typeof datos !== 'object') {
        throw crearError('Se necesita el insumo y cantidad de uso', 400);
    }
    const {idInsumo, cantidadUso} = datos;
    if(!idInsumo || typeof idInsumo !== 'number') {
        throw crearError('Especifique el insumo', 400);
    }

    if(!cantidadUso || typeof cantidadUso !== 'number' || cantidadUso <= 0) {
        throw crearError('Especifique cantidad de uso', 400);
    }

    const productoExistente = await contarProductosPorIdModel(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 404);
    }

    const insumoExistente = await contarInsumosPorIdModel(idInsumo);
    if(!insumoExistente || insumoExistente === 0){
        throw crearError('Insumo especificado no existente', 404);
    }

    const insumoProductoExistente = await contarInsumoProductoModel(productoID, idInsumo);
    if(insumoProductoExistente > 0){
        throw crearError('Insumo ya relacionado a este producto', 409);
    }

    const productoInsumos = await agregarCantidadInsumoProductoModel(productoID, idInsumo, cantidadUso);

    return {
        ok: true,
        mensaje: 'Cantidad de uso de insumo agregado correctamente',
        resultado: productoInsumos
    }
};

const actualizarCantidadInsumoProductoService = async (idProducto, datos) => {
    if (idProducto.trim() === "" || isNaN(Number(idProducto))) {
        throw crearError('Producto no valido', 400);
    }
    const productoID = Number(idProducto);
    if(!datos || typeof datos !== 'object') {
        throw crearError('Se necesita el insumo y cantidad de uso', 400);
    }
    const {idInsumo, cantidadUso} = datos;
    if(!idInsumo || typeof idInsumo !== 'number') {
        throw crearError('Especifique el insumo', 400);
    }

    if(!cantidadUso || typeof cantidadUso !== 'number' || cantidadUso <= 0) {
        throw crearError('Especifique cantidad de uso', 400);
    }

    const productoExistente = await contarProductosPorIdModel(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 404);
    }

    const insumoExistente = await contarInsumosPorIdModel(idInsumo);
    if(!insumoExistente || insumoExistente === 0){
        throw crearError('Insumo especificado no existente', 404);
    }

    const insumoProductoExistente = await contarInsumoProductoModel(productoID, idInsumo);
    if(insumoProductoExistente === 0){
        throw crearError('Insumo no relacionado a este producto', 422);
    }

    const productoInsumos = await actualizarCantidadInsumoProductoModel(productoID, idInsumo, cantidadUso);

    return {
        ok: true,
        mensaje: 'Cantidad de uso de insumo actualizado correctamente',
        resultado: productoInsumos
    }
};

const eliminarCantidadInsumoProductoService = async (idProducto, idInsumo) => {
    if (idProducto.trim() === "" || isNaN(Number(idProducto))) {
        throw crearError('Producto no valido', 400);
    }
    const productoID = Number(idProducto);

    if(!idInsumo || typeof idInsumo !== 'number') {
        throw crearError('Especifique el insumo', 400);
    }

    const insumoProductoExistente = await contarInsumoProductoModel(productoID, idInsumo);
    if(insumoProductoExistente === 0){
        throw crearError('Insumo no relacionado a este producto', 404);
    }

    const resultado = await eliminarCantidadInsumoProductoModel(productoID, idInsumo);

    return {
        ok: true,
        mensaje: resultado
    }
};

const deshabilitarProductoService = async (idProducto) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);

    const productoExistente = await contarProductosPorIdModel(productoID);
    if (!productoExistente || productoExistente === 0) {
        throw crearError('Producto especificado no existente', 404);
    }

    const resultado = await actualizarEstadoProductoModel(productoID, 0);

    return {
        ok: true,
        mensaje: resultado
    };
};

const habilitarProductoService = async (idProducto) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);
    
    const productoExistente = await contarProductosDeshabilitadosPorIdModel(productoID);
    if (!productoExistente || productoExistente === 0) {
        throw crearError('Producto especificado no existente en productos deshabilitados', 404);
    }

    const resultado = await actualizarEstadoProductoModel(productoID, 1);

    return {
        ok: true,
        mensaje: resultado
    };
};

const insertarImagenProductoService = async (idProducto, file) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);
    const productoExistente = await contarProductosPorIdModel(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 400);
    }

    let cloudinaryResult;
    try {
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw crearError('No se pudo subir la imagen a Cloudinary', 500);
    }

    fs.unlinkSync(file.path); 

    const imagen = await insertarImagenProductoModel(cloudinaryResult.secure_url, cloudinaryResult.public_id, productoID);

    return {
        ok: true,
        mensaje: 'Imagen insertada correctamente',
        imagen
    };
};

const actualizarImagenProductoService = async (datos, idImagen, file) => {
    if (!idImagen || idProducto.trim() === '' || isNaN(Number(idImagen))) {
        throw crearError('Producto no válido', 400);
    }

    const imagenID = Number(idImagen);
    if(!datos || typeof datos !== 'object' || !datos.idProducto || typeof !datos.idProducto !== 'number'){
        throw crearError('Se necesita especificar el producto', 400);
    }

    const productoExistente = await contarProductosPorIdModel(datos.idProducto);

    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 400);
    }

    const imagenExistente = await contarImagenProductoPorIdModel(imagenID);

    if(!imagenExistente || imagenExistente === 0){
        throw crearError('Imagen especificada no existente',400)
    }
    const publicID = await obtenerPublicIdPorIdImagenModel(imagenID);

     let cloudinaryResult;
    try {
        await cloudinary.uploader.destroy(publicID);
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw Object.assign(new Error('Error al actualizar imagen en Cloudinary'), { status: 500 });
    }

    const imagen = await actualizarImagenProductoModel(imagenID, cloudinaryResult.secure_url, cloudinaryResult.public_id, idProducto);

    return {
        ok: true,
        mensaje: 'Imagen actualizada correctamente',
        imagen
    }

}

module.exports = {
    agregarProductoService,
    actualizarDatosProductoService,
    agregarCantidadInsumoProductoService,
    actualizarCantidadInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    deshabilitarProductoService,
    habilitarProductoService,
    insertarImagenProductoService,
    actualizarImagenProductoService
}