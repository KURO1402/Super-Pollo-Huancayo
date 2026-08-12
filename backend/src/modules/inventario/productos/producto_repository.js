const pool = require('../../../config/conexion_DB');
const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const contarProductosNombreActInaRepository = async (nombreProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_nombre_act_ina',
        [nombreProducto],
        'Error al contar los productos por nombre.'
    );
    return rows[0][0];
};

const contarCategoriasPorIdRepository = async (idCategoria) => {
    const rows = await ejecutarSP(
        'sp_contar_categoria_por_id_2',
        [idCategoria],
        'Error al contar las categorías por id.'
    );
    return rows[0][0]?.total_categorias;
};

const contarProductosPorIdRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_por_id',
        [idProducto],
        'Error al contar los productos por id.'
    );
    return rows[0][0]?.total_registros;
};

const contarProductosDeshabilitadosPorIdRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_deshabilitados_por_id',
        [idProducto],
        'Error al contar los productos deshabilitados por id.'
    );
    return rows[0][0]?.total_registros;
};

const contarProductosNombreV2Repository = async (nombreProducto, idProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_nombre_producto_edit_v2',
        [nombreProducto, idProducto],
        'Error al contar los productos por nombre.'
    );
    return rows[0][0];
};

const contarInsumoProductoRepository = async (idProducto, idInsumo) => {
    const rows = await ejecutarSP(
        'sp_contar_insumo_producto',
        [idProducto, idInsumo],
        'Error al contar la cantidad de uso del insumo en el producto.'
    );
    return rows[0][0]?.total;
};

const contarImagenProductoPorIdRepository = async (idImagenProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_imagen_producto_por_id',
        [idImagenProducto],
        'Error al contar la imagen del producto.'
    );
    return rows[0][0]?.total;
};

const obtenerPublicIdPorIdImagenRepository = async (idImagenProducto) => {
    const rows = await ejecutarSP(
        'sp_obtener_public_id_por_id_imagen',
        [idImagenProducto],
        'Error al obtener el public_id de la imagen.'
    );
    return rows[0][0]?.public_id;
};

const contarImagenesPorProductoRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_contar_imagenes_por_producto',
        [idProducto],
        'Error al contar las imágenes del producto.'
    );
    return rows[0][0]?.total_imagenes;
};

const registraProductoRepository = async (nombre, descripcion, precio, usaInsumo, insumos, categoria, urlImagen, publicId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [result] = await conexion.execute(
            'CALL sp_registrar_producto_con_imagen(?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, usaInsumo, categoria, urlImagen, publicId]
        );

        const producto = result[0][0];

        if (usaInsumo === 1 && Array.isArray(insumos)) {
            for (const insumo of insumos) {
                await conexion.execute(
                    'CALL sp_registrar_cantidad_insumo_producto(?, ?, ?)',
                    [producto.id_producto, insumo.idInsumo, insumo.cantidadUso]
                );
            }
        }

        await conexion.commit();
        return producto;

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.log(err.message);
        const errorControlado = new Error('Error al registrar el producto en la base de datos.');
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarDatosProductoRepository = async (idProducto, nombre, descripcion, precio, categoria) => {
    const rows = await ejecutarSP(
        'sp_actualizar_datos_producto',
        [idProducto, nombre, descripcion, precio, categoria],
        'Error al actualizar el producto.'
    );
    return rows[0][0];
};

const agregarCantidadInsumoProductoRepository = async (idProducto, idInsumo, cantidadUso) => {
    const rows = await ejecutarSP(
        'sp_agregar_cantidad_insumo_producto',
        [idProducto, idInsumo, cantidadUso],
        'Error al relacionar el insumo con el producto.'
    );
    return rows[0][0];
};

const actualizarCantidadInsumoProductoRepository = async (idProducto, idInsumo, cantidadUso) => {
    const rows = await ejecutarSP(
        'sp_actualizar_cantidad_insumo_producto',
        [idProducto, idInsumo, cantidadUso],
        'Error al actualizar el insumo relacionado con el producto.'
    );
    return rows[0][0];
};

const eliminarCantidadInsumoProductoRepository = async (idProducto, idInsumo) => {
    const rows = await ejecutarSP(
        'sp_eliminar_cantidad_insumo_producto',
        [idProducto, idInsumo],
        'Error al quitar el insumo asociado al producto.'
    );
    return rows[0][0]?.mensaje;
};

const actualizarEstadoProductoRepository = async (idProducto, estadoProducto) => {
    const rows = await ejecutarSP(
        'sp_actualizar_estado_producto',
        [idProducto, estadoProducto],
        'Error al actualizar el estado del producto.'
    );
    return rows[0][0]?.mensaje;
};

const insertarImagenProductoRepository = async (url, publicId, idProducto) => {
    const rows = await ejecutarSP(
        'sp_insertar_imagen_producto',
        [url, publicId, idProducto],
        'Error al insertar la imagen del producto.'
    );
    return rows[0][0];
};

const actualizarImagenProductoRepository = async (idImagenProducto, url, publicId) => {
    const rows = await ejecutarSP(
        'sp_actualizar_imagen_producto',
        [idImagenProducto, url, publicId],
        'Error al actualizar la imagen del producto.'
    );
    return rows[0][0];
};

const eliminarImagenProductoRepository = async (idImagenProducto) => {
    const rows = await ejecutarSP(
        'sp_eliminar_imagen_producto',
        [idImagenProducto],
        'Error al eliminar la imagen del producto.'
    );
    return rows[0][0]?.mensaje;
};

const obtenerImagenProductoPorIdRepository = async (idImagenProducto) => {
    const rows = await ejecutarSP(
        'sp_obtener_imagen_producto_por_id',
        [idImagenProducto],
        'Error al obtener los datos de la imagen del producto.'
    );
    return rows[0][0];
};

const obtenerProductosCatalogoRepository = async (idCategoria = null) => {
    const rows = await ejecutarSP(
        'sp_obtener_productos_catalogo',
        [idCategoria],
        'Error al obtener los productos del catálogo.'
    );
    return rows[0];
};

const obtenerImagenesPorProductoRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_obtener_imagenes_por_producto',
        [idProducto],
        'Error al obtener las imágenes del producto.'
    );
    return rows[0];
};

const contarProductosGestionRepository = async (nombreProducto = null, usaInsumos = null, idCategoria = null) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_gestion',
        [nombreProducto, usaInsumos, idCategoria],
        'Error al contar los productos.'
    );
    return rows[0][0]?.total;
};

const obtenerProductosGestionRepository = async (nombreProducto = null, usaInsumos = null, idCategoria = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_productos_gestion',
        [nombreProducto, usaInsumos, idCategoria, limit, offset],
        'Error al obtener los productos.'
    );
    return rows[0];
};

const contarProductosDeshabilitadosRepository = async (nombreProducto = null, idCategoria = null) => {
    const rows = await ejecutarSP(
        'sp_contar_productos_gestion_deshabilitados',
        [nombreProducto, idCategoria],
        'Error al contar los productos deshabilitados.'
    );
    return rows[0][0]?.total;
};

const obtenerProductosDeshabilitadosRepository = async (nombreProducto = null, idCategoria = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_productos_gestion_deshabilitados',
        [nombreProducto, idCategoria, limit, offset],
        'Error al obtener los productos deshabilitados.'
    );
    return rows[0];
};

const obtenerProductoIdRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_obtener_producto_por_id',
        [idProducto],
        'Error al obtener el producto.'
    );
    return rows[0][0];
};

const contarImagenesProductosRepository = async (nombreProducto = null) => {
    const rows = await ejecutarSP(
        'sp_contar_imagenes_productos',
        [nombreProducto],
        'Error al contar las imágenes de productos.'
    );
    return rows[0][0]?.total;
};

const obtenerImagenesProductosRepository = async (nombreProducto = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_imagenes_productos',
        [nombreProducto, limit, offset],
        'Error al obtener las imágenes de productos.'
    );
    return rows[0];
};

const obtenerInsumosPorProductoRepository = async (idProducto) => {
    const rows = await ejecutarSP(
        'sp_obtener_insumos_por_producto',
        [idProducto],
        'Error al obtener los insumos del producto.'
    );
    return rows[0];
};

module.exports = {
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
};