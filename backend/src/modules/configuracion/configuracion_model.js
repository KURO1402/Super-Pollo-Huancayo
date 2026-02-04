const pool = require('../../config/conexion_DB');

//Modelos para categorias de productos
const insertarCategoriaProductoModel = async (nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_insertar_categoria_producto(?)', [nombreCategoria]);

        return result[0][0];
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al insertar categoria en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarCategoriaPorNombreModel = async (nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_categoria_por_nombre(?)',[nombreCategoria]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar categorías por nombre en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarCategoriaProductoModel = async (idCategoria, nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_actualizar_categoria_producto(?, ?)',[idCategoria, nombreCategoria]);

        return result[0][0];   
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al actualizar la categoria en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarCategoriaPorNombreExcluyendoIdModel = async (idCategoria, nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_categoria_por_nombre_excluyendo_id(?, ?)',[idCategoria, nombreCategoria]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar categorías por nombre en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarCategoriaPorIdModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_categoria_por_id(?)',[idCategoria]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar la categoría por id en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarCategoriaProductoModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_eliminar_categoria_producto(?)',[idCategoria]);

        return result[0][0]?.mensaje;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al eliminar la categoria en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarProductosPorCategoriaModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_contar_productos_por_categoria(?)',[idCategoria]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar productos por categoría en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarCategoriasProductoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_listar_categorias_producto()'
        );

        return result[0]; 
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al listar categorías de productos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCategoriaProductoPorIdModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_categoria_producto_por_id(?)',[idCategoria]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener la categoría por id');
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelos para tipos de documento
const insertarTipoDocumentoModel = async (nombreTipoDocumento) => {

    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_insertar_tipo_documento(?)',[nombreTipoDocumento]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al insertar tipo de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoPorNombreModel = async (nombre) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_por_nombre(?)',[nombre]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar tipos de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarTipoDocumentoModel = async (idTipoDocumento, nombreTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_tipo_documento(?, ?)',[idTipoDocumento, nombreTipoDocumento]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al actualizar tipo de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoPorIdModel = async (idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_por_id(?)',[idTipoDocumento]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar tipo de documento por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoNombreExcluyendoIdModel = async (nombreTipoDocumento, idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_nombre_excluyendo_id(?, ?)',[nombreTipoDocumento, idTipoDocumento]
        );

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar tipo de documento por nombre excluyendo ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


module.exports = {
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
}