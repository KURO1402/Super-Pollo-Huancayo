const crearError = require('../../../utilidades/crear_error');
const {
    insertarCategoriaProductoRepository,
    contarCategoriaPorNombreRepository,
    actualizarCategoriaProductoRepository,
    contarCategoriaPorNombreExcluyendoIdRepository,
    contarCategoriaPorIdRepository,
    eliminarCategoriaProductoRepository,
    contarProductosPorCategoriaRepository,
    listarCategoriasProductoRepository,
    obtenerCategoriaProductoPorIdRepository
} = require('./categorias_producto_repository');

const insertarCategoriaProductoService = async (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos para crear una nueva categoria', 400); 
    }

    const { nombreCategoria } = datos;

    if(!nombreCategoria || typeof nombreCategoria !== 'string' || !nombreCategoria.trim()) {
        throw crearError('Se necesita el nombre de la nueva categoria', 400);
    }

    const categoriaExistente = await contarCategoriaPorNombreRepository(nombreCategoria);

    if(categoriaExistente > 0) {
        throw crearError('Ya existe una categoria con ese nombre', 409);
    }

    const categoria = await insertarCategoriaProductoRepository(nombreCategoria);

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

    const existe = await contarCategoriaPorIdRepository(categoriaID);
    if (existe === 0) {
        throw crearError('La categoría no existe', 404);
    }

    const nombreDuplicado = await contarCategoriaPorNombreExcluyendoIdRepository(categoriaID, nombreCategoria);
    if (nombreDuplicado > 0) {
        throw crearError('Ya existe otra categoría con ese nombre', 409);
    }

    const categoriaActualizada = await actualizarCategoriaProductoRepository(categoriaID, nombreCategoria);

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

    const existe = await contarCategoriaPorIdRepository(categoriaID);
    if (existe === 0) {
        throw crearError('La categoría no existe', 404);
    }

    const productosAsociados = await contarProductosPorCategoriaRepository(categoriaID);

    if (productosAsociados > 0) {
        throw crearError('Primero elimine los productos asociados a esta categoria o asocialos a otra',409);
    }

    const mensaje = await eliminarCategoriaProductoRepository(categoriaID);

    return {
        ok: true,
        mensaje
    };
};

const listarCategoriasProductoService = async () => {

    const categorias = await listarCategoriasProductoRepository();

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
    const categoria = await obtenerCategoriaProductoPorIdRepository(categoriaID);

    if (!categoria) {
        throw crearError('Categoría no encontrada', 404);
    }

    return {
        ok: true,
        categoria
    };
};

module.exports = {
    insertarCategoriaProductoService,
    actualizarCategoriaProductoService,
    eliminarCategoriaProductoService,
    listarCategoriasProductoService,
    obtenerCategoriaProductoPorIdService
}