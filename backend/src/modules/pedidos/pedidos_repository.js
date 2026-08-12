const pool = require('../../config/conexion_DB');
const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerMesasPedidoRepository = async (fechaHora) => {
    const rows = await ejecutarSP(
        'sp_obtener_mesas_pedido',
        [fechaHora],
        'Error al obtener las mesas del pedido.'
    );
    return rows[0];
};

const insertarPedidoCompletoRepository = async (precio_precuenta, mesas, detalles) => {
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
        console.log(err.message);
        const errorControlado = new Error('Error al insertar el pedido en la base de datos.');
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

const listarPedidosRepository = async (fechaHora) => {
    const rows = await ejecutarSP(
        'sp_listar_pedidos',
        [fechaHora],
        'Error al listar los pedidos.'
    );
    return rows[0];
};

const listarMesasPorPedidoRepository = async (idPedido) => {
    const rows = await ejecutarSP(
        'sp_listar_mesas_por_pedido',
        [idPedido],
        'Error al listar las mesas del pedido.'
    );
    return rows[0];
};

const listarDetallePorPedidoRepository = async (idPedido) => {
    const rows = await ejecutarSP(
        'sp_listar_detalle_por_pedido',
        [idPedido],
        'Error al listar el detalle del pedido.'
    );
    return rows[0];
};

const validarMesaDisponibleRepository = async (idMesa, fechaHora) => {
    const rows = await ejecutarSP(
        'sp_validar_mesa_disponible',
        [idMesa, fechaHora],
        'Error al validar la disponibilidad de la mesa.'
    );
    return rows[0][0].ocupada === 0;
};

const obtenerEstadoPedidoRepository = async (idPedido) => {
    const rows = await ejecutarSP(
        'sp_obtener_estado_pedido',
        [idPedido],
        'Error al obtener el estado del pedido.'
    );
    return rows[0][0];
};

const obtenerDetallePedidoRepository = async (idPedido) => {
    const rows = await ejecutarSP(
        'sp_obtener_detalle_pedido',
        [idPedido],
        'Error al obtener el detalle del pedido.'
    );
    return rows[0];
};

const obtenerMesasDeUnPedidoRepository = async (idPedido) => {
    const rows = await ejecutarSP(
        'sp_obtener_mesas_de_un_pedido',
        [idPedido],
        'Error al obtener las mesas del pedido.'
    );
    return rows[0];
};

const obtenerUltimoPedidoMesaRepository = async (idMesa) => {
    const rows = await ejecutarSP(
        'sp_obtener_ultimo_pedido_mesa',
        [idMesa],
        'Error al obtener el pedido activo de la mesa.'
    );
    return rows[0][0]; 
};

const editarPedidoCompletoRepository = async (idPedido, precio_precuenta, nuevasMesas, nuevosDetalles) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        await conexion.execute('CALL sp_limpiar_pedido_para_edicion(?)', [idPedido]);

        for (const id_mesa of nuevasMesas) {
            await conexion.execute('CALL sp_insertar_mesa_pedido(?, ?)', [id_mesa, idPedido]);
        }

        for (const detalle of nuevosDetalles) {
            await conexion.execute(
                'CALL sp_insertar_detalle_pedido(?, ?, ?)',
                [idPedido, detalle.id_producto, detalle.cantidad]
            );
        }

        await conexion.execute('CALL sp_actualizar_precio_pedido(?, ?)', [idPedido, precio_precuenta]);

        await conexion.commit();

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.log(err.message);
        const errorControlado = new Error('Error al editar el pedido en la base de datos.');
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

const cancelarPedidoRepository = async (idPedido) => {
    return await ejecutarSP(
        'sp_cancelar_pedido',
        [idPedido],
        'Error al cancelar el pedido.'
    );
};


const completarPedidoRepository = async (idPedido) => {
    return await ejecutarSP(
        'sp_completar_pedido',
        [idPedido],
        'Error al completar el pedido.'
    );
};

module.exports = {
    obtenerMesasPedidoRepository,
    insertarPedidoCompletoRepository,
    listarPedidosRepository,
    listarMesasPorPedidoRepository,
    listarDetallePorPedidoRepository,
    validarMesaDisponibleRepository,
    obtenerEstadoPedidoRepository,
    obtenerDetallePedidoRepository,
    obtenerMesasDeUnPedidoRepository,
    editarPedidoCompletoRepository,
    obtenerUltimoPedidoMesaRepository,
    cancelarPedidoRepository,
    completarPedidoRepository
};