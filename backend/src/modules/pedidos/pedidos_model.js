const pool = require('../../config/conexion_DB');

const obtenerMesasPedidoModel = async (fechaHora) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_mesas_pedido(?)', [fechaHora]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener las mesas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const insertarPedidoCompletoModel = async (precio_precuenta, mesas, detalles) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [[pedido]] = await conexion.execute(
            'CALL sp_insertar_pedido(?)', 
            [precio_precuenta]
        );
        const id_pedido = pedido[0].id_pedido;

        for (const id_mesa of mesas) {
            await conexion.execute(
                'CALL sp_insertar_mesa_pedido(?, ?)', 
                [id_mesa, id_pedido]
            );
        }

        for (const detalle of detalles) {
            await conexion.execute(
                'CALL sp_insertar_detalle_pedido(?, ?, ?)', 
                [id_pedido, detalle.id_producto, detalle.cantidad]
            );
        }

        await conexion.commit();
        return { id_pedido };

    } catch (err) {
        if (conexion) await conexion.rollback();
        throw new Error('Error al insertar el pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarPedidosModel = async (fechaHora) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_listar_pedidos(?)', [fechaHora]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al listar los pedidos en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarMesasPorPedidoModel = async (idPedido) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_listar_mesas_por_pedido(?)', [idPedido]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al listar las mesas del pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarDetallePorPedidoModel = async (idPedido) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_listar_detalle_por_pedido(?)', [idPedido]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al listar el detalle del pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const validarMesaDisponibleModel = async (idMesa, fechaHora) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_validar_mesa_disponible(?, ?)', 
            [idMesa, fechaHora]
        );
        return rows[0][0].ocupada === 0;
    } catch (err) {
        throw new Error('Error al validar disponibilidad de mesa en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerEstadoPedidoModel = async (idPedido) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_estado_pedido(?)', [idPedido]);
        return rows[0][0];
    } catch (err) {
        throw new Error('Error al obtener el estado del pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


const obtenerDetallePedidoModel = async (idPedido) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_detalle_pedido(?)', [idPedido]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el detalle del pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


const obtenerMesasDeUnPedidoModel = async (idPedido) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_mesas_de_un_pedido(?)', [idPedido]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener las mesas del pedido en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
  obtenerMesasPedidoModel,
  insertarPedidoCompletoModel,
  listarPedidosModel,
  listarMesasPorPedidoModel,
  listarDetallePorPedidoModel,
  validarMesaDisponibleModel,
  obtenerEstadoPedidoModel,
  obtenerDetallePedidoModel,
  obtenerMesasDeUnPedidoModel
}