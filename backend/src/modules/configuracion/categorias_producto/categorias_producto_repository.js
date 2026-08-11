const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const insertarCategoriaProductoRepository = async (nombreCategoria) => {
    const rows = await ejecutarSP(
        'sp_insertar_categoria_producto',
        [nombreCategoria],
        'Error al insertar la categoría.'
    );
    return rows[0][0];
};

const contarCategoriaPorNombreRepository = async (nombreCategoria) => {
    const rows = await ejecutarSP(
        'sp_contar_categoria_por_nombre',
        [nombreCategoria],
        'Error al contar las categorías por nombre.'
    );
    return rows[0][0]?.total;
};

const actualizarCategoriaProductoRepository = async (idCategoria, nombreCategoria) => {
    const rows = await ejecutarSP(
        'sp_actualizar_categoria_producto',
        [idCategoria, nombreCategoria],
        'Error al actualizar la categoría.'
    );
    return rows[0][0];
};

const contarCategoriaPorNombreExcluyendoIdRepository = async (idCategoria, nombreCategoria) => {
    const rows = await ejecutarSP(
        'sp_contar_categoria_por_nombre_excluyendo_id',
        [idCategoria, nombreCategoria],
        'Error al contar las categorías por nombre.'
    );
    return rows[0][0]?.total;
};

const contarCategoriaPorIdRepository = async (idCategoria) => {
    const rows = await ejecutarSP(
        'sp_contar_categoria_por_id',
        [idCategoria],
        'Error al contar la categoría por id.'
    );
    return rows[0][0]?.total;
};

const eliminarCategoriaProductoRepository = async (idCategoria) => {
    const rows = await ejecutarSP(
        'sp_eliminar_categoria_producto',
        [idCategoria],
        'Error al eliminar la categoría.'
    );
    return rows[0][0]?.mensaje;
};

const contarProductosPorCategoriaRepository = async (idCategoria) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_por_categoria',
        [idCategoria],
        'Error al contar los productos por categoría.'
    );
    return rows[0][0]?.total;
};

const listarCategoriasProductoRepository = async () => {
    const rows = await ejecutarSP(
        'sp_listar_categorias_producto',
        [],
        'Error al listar las categorías de productos.'
    );
    return rows[0];
};

const obtenerCategoriaProductoPorIdRepository = async (idCategoria) => {
    const rows = await ejecutarSP(
        'sp_obtener_categoria_producto_por_id',
        [idCategoria],
        'Error al obtener la categoría por id.'
    );
    return rows[0][0];
};

module.exports = {
    insertarCategoriaProductoRepository,
    contarCategoriaPorNombreRepository,
    actualizarCategoriaProductoRepository,
    contarCategoriaPorNombreExcluyendoIdRepository,
    contarCategoriaPorIdRepository,
    eliminarCategoriaProductoRepository,
    contarProductosPorCategoriaRepository,
    listarCategoriasProductoRepository,
    obtenerCategoriaProductoPorIdRepository
};