const crearError = require('../../utilidades/crear_error');
const {
    insertarCategoriaProductoModel,
    contarCategoriaPorNombreModel,
    actualizarCategoriaProductoModel,
    contarCategoriaPorNombreExcluyendoIdModel,
    contarCategoriaPorIdModel,
    eliminarCategoriaProductoModel,
    contarProductosPorCategoriaModel,
    listarCategoriasProductoModel,
    obtenerCategoriaProductoPorIdModel,
    insertarTipoDocumentoModel,
    contarTipoDocumentoPorNombreModel,
    actualizarTipoDocumentoModel,
    contarTipoDocumentoPorIdModel,
    contarTipoDocumentoNombreExcluyendoIdModel
} = require('./configuracion_model');

const insertarCategoriaProductoService = async (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos para crear una nueva categoria', 400); 
    }

    const { nombreCategoria } = datos;

    if(!nombreCategoria || typeof nombreCategoria !== 'string' || !nombreCategoria.trim()) {
        throw crearError('Se necesita el nombre de la nueva categoria', 400);
    }

    const categoriaExistente = await contarCategoriaPorNombreModel(nombreCategoria);

    if(categoriaExistente > 0) {
        throw crearError('Ya existe una categoria con ese nombre', 409);
    }

    const categoria = await insertarCategoriaProductoModel(nombreCategoria);

    return {
        ok: true,
        mensaje: 'Categoria de productos insertado correctamente',
        categoria
    }

};

const actualizarCategoriaProductoService = async (datos, idCategoria) => {
    if (!idCategoria.trim() || isNaN(Number(idCategoria))) {
        throw crearError('Categoria no valida', 400);
    }
    const categoriaID = Number(idCategoria);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para actualizar la categoría', 400);
    }

    const { nombreCategoria } = datos;
    

    if (!nombreCategoria || typeof nombreCategoria !== 'string' || !nombreCategoria.trim()) {
        throw crearError('El nombre de la categoría es obligatorio', 400);
    }

    const existe = await contarCategoriaPorIdModel(categoriaID);
    if (existe === 0) {
        throw crearError('La categoría no existe', 404);
    }

    const nombreDuplicado = await contarCategoriaPorNombreExcluyendoIdModel(categoriaID, nombreCategoria);
    if (nombreDuplicado > 0) {
        throw crearError('Ya existe otra categoría con ese nombre', 409);
    }

    const categoriaActualizada = await actualizarCategoriaProductoModel(categoriaID, nombreCategoria);

    return {
        ok: true,
        mensaje: 'Categoría actualizada correctamente',
        categoria: categoriaActualizada
    };
};

const eliminarCategoriaProductoService = async (idCategoria) => {

    if (!idCategoria.trim() || isNaN(Number(idCategoria))) {
        throw crearError('Categoria no valida', 400);
    }
    const categoriaID = Number(idCategoria);

    const existe = await contarCategoriaPorIdModel(categoriaID);
    if (existe === 0) {
        throw crearError('La categoría no existe', 404);
    }

    const productosAsociados = await contarProductosPorCategoriaModel(categoriaID);

    if (productosAsociados > 0) {
        throw crearError('Primero elimine los productos asociados a esta categoria o asocialos a otra',409);
    }

    const mensaje = await eliminarCategoriaProductoModel(categoriaID);

    return {
        ok: true,
        mensaje
    };
};

const listarCategoriasProductoService = async () => {

    const categorias = await listarCategoriasProductoModel();

    if(!categorias || categorias.length === 0) {
        throw crearError('No se encontraron categorias para productos', 404);
    }

    return {
        ok: true,
        categorias
    };
};

const obtenerCategoriaProductoPorIdService = async (idCategoria) => {

    if (!idCategoria || isNaN(Number(idCategoria))) {
        throw crearError('El id de la categoría es obligatorio', 400);
    }
    const categoriaID = Number(idCategoria);
    const categoria = await obtenerCategoriaProductoPorIdModel(categoriaID);

    if (!categoria) {
        throw crearError('Categoría no encontrada', 404);
    }

    return {
        ok: true,
        categoria
    };
};

//Servicios para tipo d documento
const insertarTipoDocumentoService = async (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos para crear un nuevo tipo de documento', 400); 
    }

    const { nombreDocumento } = datos;

    if(!nombreDocumento || typeof nombreDocumento !== 'string' || !nombreDocumento.trim()) {
        throw crearError('Se necesita el nombre de el nuevo tipo de documento', 400);
    }

    const nombreCoincidente = await contarTipoDocumentoPorNombreModel(nombreDocumento);
    if(nombreCoincidente > 0) {
        throw crearError('Ya existe un tipo de documento con ese nombre', 409);
    }

    const tipo_documento = await insertarTipoDocumentoModel(nombreDocumento);

    return {
        ok: true,
        mensaje: 'Tipo de documento insertado correctamente',
        tipo_documento
    }
};

const actualizarTipoDocumentoService = async (datos, idTipoDocumento) => {

    if (!idTipoDocumento.trim() || isNaN(Number(idTipoDocumento))) {
        throw crearError('ID de tipo de documento no válido', 400);
    }
    const tipoDocumentoID = Number(idTipoDocumento);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para actualizar el tipo de documento', 400);
    }

    const { nombreDocumento } = datos;

    if (!nombreDocumento || typeof nombreDocumento !== 'string' || !nombreDocumento.trim()) {
        throw crearError('El nombre del tipo de documento es obligatorio', 400);
    }
    const existe = await contarTipoDocumentoPorIdModel(tipoDocumentoID);
    if (existe === 0) {
        throw crearError('El tipo de documento no existe', 404);
    }

    const nombreDuplicado = await contarTipoDocumentoNombreExcluyendoIdModel(nombreDocumento, tipoDocumentoID);
    if (nombreDuplicado > 0) {
        throw crearError('Ya existe otro tipo de documento con ese nombre', 409);
    }

    const tipoDocumentoActualizado = await actualizarTipoDocumentoModel(tipoDocumentoID, nombreDocumento);

    return {
        ok: true,
        mensaje: 'Tipo de documento actualizado correctamente',
        tipoDocumento: tipoDocumentoActualizado
    };
};

module.exports = {
    insertarCategoriaProductoService,
    actualizarCategoriaProductoService,
    eliminarCategoriaProductoService,
    listarCategoriasProductoService,
    obtenerCategoriaProductoPorIdService,
    insertarTipoDocumentoService,
    actualizarTipoDocumentoService 
}