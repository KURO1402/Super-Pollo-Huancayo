const cloudinary = require('../../../config/cloudinary_config');
const fs = require('fs');

const { validarDatosProducto, validarDatosActualizarProducto } = require('./producto_validacion');

const {
    contarProductosNombreActInaRepository,
    contarCategoriasPorIdRepository,
    contarProductosPorIdRepository,
    contarProductosDeshabilitadosPorIdRepository,
    contarProductosNombreV2Repository,
    contarInsumoProductoRepository,
    contarImagenProductoPorIdRepository,
    obtenerPublicIdPorIdImagenRepository,
    contarImagenesPorProductoRepository,
    registraProductoRepository,
    actualizarDatosProductoRepository,
    agregarCantidadInsumoProductoRepository,
    actualizarCantidadInsumoProductoRepository,
    eliminarCantidadInsumoProductoRepository,
    actualizarEstadoProductoRepository,
    insertarImagenProductoRepository,
    actualizarImagenProductoRepository,
    eliminarImagenProductoRepository,
    obtenerImagenProductoPorIdRepository,
    obtenerProductosCatalogoRepository,
    obtenerImagenesPorProductoRepository,
    contarProductosGestionRepository,
    obtenerProductosGestionRepository,
    contarProductosDeshabilitadosRepository,
    obtenerProductosDeshabilitadosRepository,
    obtenerProductoIdRepository,
    contarImagenesProductosRepository,
    obtenerImagenesProductosRepository,
    obtenerInsumosPorProductoRepository   
} = require('./producto_repository');

const { contarInsumosPorIdRepository } = require('../insumos/insumos_repository');

const crearError = require('../../../utilidades/crear_error');

const agregarProductoService = async (datos, file) => {
    validarDatosProducto(datos);
    const { nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria } = datos;
    const coincidenciasNombre = await contarProductosNombreActInaRepository(nombreProducto);

    if (coincidenciasNombre.total_activos > 0) {
        fs.unlinkSync(file.path); 
        throw crearError('El nombre de producto ya está en uso', 400);
    } else if (coincidenciasNombre.total_inactivos > 0) {
        fs.unlinkSync(file.path); 
        throw crearError('El nombre de producto coincide con un producto inactivo. Por favor, reactívelo o use otro nombre.', 409);
    };

    const categoriasId = await contarCategoriasPorIdRepository(idCategoria);

    if(!categoriasId || categoriasId === 0){
        fs.unlinkSync(file.path); 
        throw crearError('La categoria especificada no existe', 400);
    }

    let cloudinaryResult;
    try {
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        fs.unlinkSync(file.path); 
        throw crearError('No se pudo subir la imagen a Cloudinary', 500);
    }

    fs.unlinkSync(file.path); 

    const producto = await registraProductoRepository(nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria, cloudinaryResult.secure_url, cloudinaryResult.public_id);

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
    const productosExistentes = await contarProductosPorIdRepository(productoID);

    if(productosExistentes === 0){
        throw crearError('El producto especificado no existe', 404)
    }

    const categoriasId = await contarCategoriasPorIdRepository(idCategoria);

    if(!categoriasId || categoriasId === 0){
        throw crearError('La categoria especificada no existe', 400);
    }

    const coincidenciasNombre = await contarProductosNombreV2Repository(nombreProducto, productoID);
    if(coincidenciasNombre.total_activos > 0){
        throw crearError('Ese nombre de producto ya esta en uso', 400);
    } else if(coincidenciasNombre.total_inactivos > 0) {
        throw crearError('Ese nombre de producto coincide con un producto inactivo. Por favor, reactívelo o use otro nombre.', 400);
    }

    const productoActualizado = await actualizarDatosProductoRepository(productoID, nombreProducto, descripcionProducto, precioProducto, idCategoria);

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

    const productoExistente = await contarProductosPorIdRepository(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 404);
    }

    const insumoExistente = await contarInsumosPorIdRepository(idInsumo);
    if(!insumoExistente || insumoExistente === 0){
        throw crearError('Insumo especificado no existente', 404);
    }

    const insumoProductoExistente = await contarInsumoProductoRepository(productoID, idInsumo);
    if(insumoProductoExistente > 0){
        throw crearError('Insumo ya relacionado a este producto', 409);
    }

    const productoInsumos = await agregarCantidadInsumoProductoRepository(productoID, idInsumo, cantidadUso);

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

    const productoExistente = await contarProductosPorIdRepository(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 404);
    }

    const insumoExistente = await contarInsumosPorIdRepository(idInsumo);
    if(!insumoExistente || insumoExistente === 0){
        throw crearError('Insumo especificado no existente', 404);
    }

    const insumoProductoExistente = await contarInsumoProductoRepository(productoID, idInsumo);
    if(insumoProductoExistente === 0){
        throw crearError('Insumo no relacionado a este producto', 422);
    }

    const productoInsumos = await actualizarCantidadInsumoProductoRepository(productoID, idInsumo, cantidadUso);

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

    const insumoProductoExistente = await contarInsumoProductoRepository(productoID, idInsumo);
    if(insumoProductoExistente === 0){
        throw crearError('Insumo no relacionado a este producto', 404);
    }

    const resultado = await eliminarCantidadInsumoProductoRepository(productoID, idInsumo);

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

    const productoExistente = await contarProductosPorIdRepository(productoID);
    if (!productoExistente || productoExistente === 0) {
        throw crearError('Producto especificado no existente', 404);
    }

    const resultado = await actualizarEstadoProductoRepository(productoID, 0);

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
    
    const productoExistente = await contarProductosDeshabilitadosPorIdRepository(productoID);
    if (!productoExistente || productoExistente === 0) {
        throw crearError('Producto especificado no existente en productos deshabilitados', 404);
    }

    const resultado = await actualizarEstadoProductoRepository(productoID, 1);

    return {
        ok: true,
        mensaje: resultado
    };
};

const insertarImagenProductoService = async (idProducto, file) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        fs.unlinkSync(file.path); 
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);
    const productoExistente = await contarProductosPorIdRepository(productoID);
    if(!productoExistente || productoExistente === 0){
        fs.unlinkSync(file.path); 
        throw crearError('Producto especificado no existente', 400);
    }

    let cloudinaryResult;
    try {
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        fs.unlinkSync(file.path); 
        throw crearError('No se pudo subir la imagen a Cloudinary', 500);
    }

    fs.unlinkSync(file.path); 

    const imagen = await insertarImagenProductoRepository(cloudinaryResult.secure_url, cloudinaryResult.public_id, productoID);

    return {
        ok: true,
        mensaje: 'Imagen insertada correctamente',
        imagen
    };
};

const actualizarImagenProductoService = async (idImagen, file) => {
    if (!idImagen || idImagen.trim() === '' || isNaN(Number(idImagen))) {
        fs.unlinkSync(file.path); 
        throw crearError('Producto no válido', 400);
    }

    const imagenID = Number(idImagen);

    const imagenExistente = await contarImagenProductoPorIdRepository(imagenID);

    if(!imagenExistente || imagenExistente === 0){
        fs.unlinkSync(file.path); 
        throw crearError('Imagen especificada no existente',400)
    }
    const publicID = await obtenerPublicIdPorIdImagenRepository(imagenID);

    let cloudinaryResult;
    try {
        await cloudinary.uploader.destroy(publicID);
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        fs.unlinkSync(file.path); 
        throw crearError('Error al actualizar imagen en Cloudinary', 500);
    }

    const imagen = await actualizarImagenProductoRepository(imagenID, cloudinaryResult.secure_url, cloudinaryResult.public_id);
    fs.unlinkSync(file.path);
    return {
        ok: true,
        mensaje: 'Imagen actualizada correctamente',
        imagen
    }

};

const eliminarImagenProductoService = async (idImagen) => {
    if (!idImagen || idImagen.trim() === '' || isNaN(Number(idImagen))) {
        throw crearError('Producto no válido', 400);
    }

    const imagenID = Number(idImagen);

    const imagenExistente = await obtenerImagenProductoPorIdRepository(imagenID);

    if(!imagenExistente || imagenExistente.length === 0){
        throw crearError('Imagen especificada no existente',400)
    }

    const cantidadImagenesProducto = await contarImagenesPorProductoRepository(imagenExistente.id_producto);

    if(cantidadImagenesProducto === 1 || cantidadImagenesProducto === 0){
        throw crearError('La imagen es unica del producto y no puede ser eliminada', 400);
    }

    try {
        const resultado = await cloudinary.uploader.destroy(imagenExistente.public_id);
        if (resultado.result !== 'ok') {
            throw crearError('No se pudo eliminar la imagen en Cloudinary', 500);
        }
    } catch (err) {
        throw crearError('Error al eliminar imagen en Cloudinary', 500);
    }

    const resultado = await eliminarImagenProductoRepository(imagenID);

    return {
        ok: true,
        mensaje: resultado
    }
};

const obtenerProductosCatalogoService = async (idCategoria) => {

    const productos = await obtenerProductosCatalogoRepository(idCategoria);

    if(!productos || productos.length === 0) {
        throw crearError('No se encontraron productos', 404);
    }

    for(const producto of productos) {
        const imagenes = await obtenerImagenesPorProductoRepository(producto.id_producto);
        producto.imagenes = imagenes;
    }

    return {
        ok: true,
        productos
    }
};

const obtenerProductosGestionService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'nombre', 'usaInsumos', 'contarCategoriasPorIdRepository', 'categoria'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido',400);
    }
    const { limit, offset, nombre, usaInsumos, contarCategoriasPorIdRepository, categoria  } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    let insumosUsa;
    if (typeof usaInsumos === 'string') {
        const valor = usaInsumos.toLowerCase();
        if (valor === 'si') {
            insumosUsa = 1;
        } else if (valor === 'no') {
            insumosUsa = 0;
        } else {
            throw crearError(`Para el filtro solo pon "si" si usa insumos y "no" si no lo usa"`, 400)
        }
    }

    const cacheKey = `productos_gestion:count:${nombre || 'null'}:${insumosUsa ?? 'null'}:${categoria || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {

        const productos = await obtenerProductosGestionRepository(nombre, insumosUsa, categoria, limite, desplazamiento);

        if (!productos || productos.length === 0) {
            throw crearError('No se encontraron productos', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            productos
        };
    }


    const totalRegistros = await contarProductosGestionRepository(nombre, insumosUsa, categoria);

    cache.set(cacheKey, totalRegistros);

    const productos = await obtenerProductosGestionRepository(nombre, insumosUsa, categoria, limite, desplazamiento);

    if (!productos || productos.length === 0) {
        throw crearError('No se encontraron productos', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalRegistros,
        productos
    };
};

const obtenerProductosDeshabilitadosService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'nombre', 'categoria'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido', 400);
    }

    const { limit, offset, nombre, categoria } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const cacheKey = `productos_deshabilitados:count:${nombre || 'null'}:${categoria || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        

        const productos = await obtenerProductosDeshabilitadosRepository(nombre, categoria, limite, desplazamiento);

        if (!productos || productos.length === 0) {
            throw crearError('No se encontraron productos', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            productos
        };
    }

    

    const totalRegistros = await contarProductosDeshabilitadosRepository(nombre, categoria);

    cache.set(cacheKey, totalRegistros);

    const productos = await obtenerProductosDeshabilitadosRepository(nombre, categoria, limite, desplazamiento);

    if (!productos || productos.length === 0) {
        throw crearError('No se encontraron productos deshabilitados', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalRegistros,
        productos
    };
};

const obtenerProductoIdService = async (idProducto) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);
    const producto = await obtenerProductoIdRepository(productoID);
    if(!producto) {
        throw crearError('No existe el producto especificado');
    }

    return {
        ok: true,
        producto
    }
};

const obtenerImagenesPorProductoService =  async (idProducto) => {
    if (!idProducto || idProducto.trim() === '' || isNaN(Number(idProducto))) {
        throw crearError('Producto no válido', 400);
    }

    const productoID = Number(idProducto);
    const productoExistente = await contarProductosPorIdRepository(productoID);
    if(!productoExistente || productoExistente === 0){
        throw crearError('Producto especificado no existente', 404);
    }
    const imagenes = await obtenerImagenesPorProductoRepository(productoID);
    
    if(!imagenes || imagenes.length === 0) {
        throw  crearError('No se encontraron imagenes para el producto especificado', 404)
    }

    return {
        ok: true,
        imagenes
    }
};

const obtenerImagenesProductosService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'nombre'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido', 400);
    }

    const { limit, offset, nombre } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const cacheKey = `imagenes_productos:count:${nombre || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        

        const imagenes = await obtenerImagenesProductosRepository(nombre, limite, desplazamiento);

        if (!imagenes || imagenes.length === 0) {
            throw crearError('No se encontraron imágenes', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            imagenes
        };
    }

    

    const totalRegistros = await contarImagenesProductosRepository(nombre);

    cache.set(cacheKey, totalRegistros);

    const imagenes = await obtenerImagenesProductosRepository(nombre, limite, desplazamiento);

    if (!imagenes || imagenes.length === 0) {
        throw crearError('No se encontraron imágenes', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalRegistros,
        imagenes
    };
};

const obtenerInsumosPorProductoService = async (idProducto) => {
    if (!idProducto || isNaN(idProducto)) {
        throw crearError('El id del producto es inválido', 400);
    }
    const productoID = Number(idProducto);

    const producto = await obtenerProductoIdRepository(productoID);

    if(!producto) {
        throw crearError('Producto especificado no existente', 404);
    }
    
    if(producto.usa_insumos === 'No') {
        throw crearError('El producto no tiene activado el inventario');
    }

    const insumos = await obtenerInsumosPorProductoRepository(productoID);

    if (!insumos || insumos.length === 0) {
        throw crearError('El producto no tiene insumos registrados', 404);
    }

    return {
        ok: true,
        insumos
    };
};

module.exports = {
    agregarProductoService,
    actualizarDatosProductoService,
    agregarCantidadInsumoProductoService,
    actualizarCantidadInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    deshabilitarProductoService,
    habilitarProductoService,
    insertarImagenProductoService,
    actualizarImagenProductoService,
    eliminarImagenProductoService,
    obtenerProductosCatalogoService,
    obtenerProductosGestionService,
    obtenerProductosDeshabilitadosService,
    obtenerProductoIdService,
    obtenerImagenesPorProductoService,
    obtenerImagenesProductosService,
    obtenerInsumosPorProductoService
}