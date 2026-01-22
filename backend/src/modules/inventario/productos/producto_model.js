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
        console.log(err.message);
        if (conexion) await conexion.rollback();
        throw new Error('Error al registrar el producto en la base de datos');

    } finally {
        if (conexion) conexion.release();
    }
};




module.exports = {
    contarProductosNombreActInaModel,
    contarCategoriasPorIdModel,
    registraProductoModel
}