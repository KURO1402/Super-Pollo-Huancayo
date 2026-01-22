const pool = require('../../../config/conexion_DB');

const contarProductosNombreActInaModel = async (nombreProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_productos_nombre_act_ina(?)', [nombreProducto]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al contar productos en la abse de datos');
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

module.exports = {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel
}