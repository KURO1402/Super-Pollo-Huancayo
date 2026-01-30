const pool = require('../../../config/conexion_DB');

//Modelos para validaciones
const contarProductosNombreActInaModel = async (nombreProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_productos_nombre_act_ina(?)', [nombreProducto]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al contar productos en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const contarCategoriasPorIdModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_categoria_por_id(?)', [idCategoria]);

        return result[0][0]?.total_categorias;
    } catch (err) {
        throw new Error('Error al contar categorias en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const contarProductosPorIdModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_productos_por_id(?)', [idProducto]);

        return result[0][0]?.total_registros;
    } catch (err) {
        throw new Error('Error al contar productos en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const contarProductosDeshabilitadosPorIdModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_productos_deshabilitados_por_id(?)', [idProducto]);

        return result[0][0]?.total_registros;
    } catch (err) {
        throw new Error('Error al contar productos en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const contarProductosNombreV2Model = async (nombreProducto, idProducto) =>{
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_nombre_producto_edit_v2(?, ?)', [nombreProducto, idProducto]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al contar productos en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
}

const contarInsumoProductoModel = async (idProducto, idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_insumo_producto(?, ?)', [idProducto, idInsumo]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar cantidad de uso de insumo de un producto de la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const contarImagenProductoPorIdModel = async (idImagenProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_imagen_producto_por_id(?)',[idImagenProducto]);

        return result[0][0]?.total;

    } catch (err) {
        throw new Error('Error al contar la imagen del producto en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerPublicIdPorIdImagenModel = async (idImagenProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_public_id_por_id_imagen(?)',[idImagenProducto]);

        return result[0][0]?.public_id;

    } catch (err) {
        throw new Error('Error al obtener el public_id de la imagen en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarImagenesPorProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_imagenes_por_producto(?)',[idProducto]);

        return result[0][0]?.total_imagenes;

    } catch (err) {
        throw new Error('Error al contar las imágenes del producto');
    } finally {
        if (conexion) conexion.release();
    }
};


//Modelo para productos
const registraProductoModel = async ( nombre, descripcion, precio, usaInsumo, insumos, categoria, urlImagen, publicId ) => {
    let conexion;

    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [result] = await conexion.execute(
            'CALL sp_registrar_producto_con_imagen(?, ?, ?, ?, ?, ?, ?)',[nombre, descripcion, precio, usaInsumo, categoria, urlImagen, publicId]);

        const producto = result[0][0];

        if (usaInsumo === 1 && Array.isArray(insumos)) {
            for (const insumo of insumos) {
                await conexion.execute(
                    'CALL sp_registrar_cantidad_insumo_producto(?, ?, ?)',[producto.id_producto,insumo.idInsumo,insumo.cantidadUso]);
            }
        }

        await conexion.commit();

        return producto;

    } catch (err) {
        if (conexion) await conexion.rollback();
        throw new Error('Error al registrar el producto en la base de datos');

    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarDatosProductoModel = async (idProducto, nombre, descripcion, precio, categoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_datos_producto(?, ?, ?, ?, ?)', [idProducto, nombre, descripcion, precio, categoria]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al actualizar producto en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const agregarCantidadInsumoProductoModel = async (idProducto, idInsumo, cantidadUso) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_agregar_cantidad_insumo_producto(?, ?, ?)', [idProducto, idInsumo, cantidadUso]);

        return result[0][0];
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al relacionar insumo con el producto en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const actualizarCantidadInsumoProductoModel = async (idProducto, idInsumo, cantidadUso) => {
let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_cantidad_insumo_producto(?, ?, ?)', [idProducto, idInsumo, cantidadUso]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al actualizar el insumo relacionado con el producto en la base de datos');
    } finally {
        if(conexion) conexion.release();
    } 
};

const eliminarCantidadInsumoProductoModel = async (idProducto, idInsumo) => {
let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_eliminar_cantidad_insumo_producto(?, ?)', [idProducto, idInsumo]);

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al quitar insumo asociado al producto en la base de datos');
    } finally {
        if(conexion) conexion.release();
    } 
};

const actualizarEstadoProductoModel = async (idProducto, estadoProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_actualizar_estado_producto(?, ?)',[idProducto, estadoProducto]);

        return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error('Error al actualizar el estado del producto en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const insertarImagenProductoModel = async (url, publicId, idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_insertar_imagen_producto(?, ?, ?)', [url, publicId, idProducto]);

        return result[0][0];

    } catch (err) {
        throw new Error('Error al insertar imagen del producto en la base de datos');
    } finally {
        if(conexion) conexion.release();
    }
};

const actualizarImagenProductoModel = async (idImagenProducto, url, publicId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_actualizar_imagen_producto(?, ?, ?)',[idImagenProducto, url, publicId]);

        return result[0][0];

    } catch (err) {
        throw new Error('Error al actualizar imagen del producto en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarImagenProductoModel = async (idImagenProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_eliminar_imagen_producto(?)',[idImagenProducto]);

        return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error('Error al eliminar imagen del producto en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para obtener datos
const obtenerImagenProductoPorIdModel = async (idImagenProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_imagen_producto_por_id(?)',[idImagenProducto]);

        return result[0][0];

    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener los datos de la imagen del producto');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerProductosCatalogoModel = async (idCategoria = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_obtener_productos_catalogo(?)', [idCategoria]);

        return result[0]; 

    } catch (err) {
        throw new Error('Error al obtener los productos de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerImagenesPorProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_imagenes_por_producto(?)',[idProducto]);

        return result[0];

    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener los datos de la imagen del producto');
    } finally {
        if (conexion) conexion.release();
    }
};


module.exports = {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel,
    contarProductosPorIdModel,
    contarProductosDeshabilitadosPorIdModel,
    contarProductosNombreV2Model,
    contarInsumoProductoModel,
    contarImagenProductoPorIdModel,
    obtenerPublicIdPorIdImagenModel,
    contarImagenesPorProductoModel ,
    registraProductoModel,
    actualizarDatosProductoModel,
    agregarCantidadInsumoProductoModel,
    actualizarCantidadInsumoProductoModel,
    eliminarCantidadInsumoProductoModel,
    actualizarEstadoProductoModel,
    insertarImagenProductoModel,
    actualizarImagenProductoModel,
    eliminarImagenProductoModel,
    obtenerImagenProductoPorIdModel,
    obtenerProductosCatalogoModel,
    obtenerImagenesPorProductoModel 
}