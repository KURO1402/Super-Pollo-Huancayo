const crearError = require('../../utilidades/crear_error');
const { obtenerProductoIdModel } = require('../inventario/productos/producto_model');
const pusher = require('../../config/pusher');

const {
    obtenerMesasPedidoModel,
    insertarPedidoCompletoModel,
    listarPedidosModel,
    listarMesasPorPedidoModel,
    listarDetallePorPedidoModel,
    validarMesaDisponibleModel,
    obtenerEstadoPedidoModel,
    obtenerDetallePedidoModel,
    obtenerMesasDeUnPedidoModel,
    obtenerUltimoPedidoMesaModel,
    editarPedidoCompletoModel,
    cancelarPedidoModel,
    completarPedidoModel,
} = require('./pedidos_model');

const obtenerMesasPedidoService = async (fecha, hora) => {

    if (!fecha || typeof fecha !== 'string') {
        throw crearError('Se necesita una fecha válida.', 400);
    }

    if (!hora || typeof hora !== 'string') {
        throw crearError('Se necesita una hora válida.', 400);
    }

    const fechaHora = `${fecha} ${hora}:00`;

    if (isNaN(Date.parse(fechaHora))) {
        throw crearError('La fecha y hora proporcionadas no son válidas.', 400);
    }

    const mesas = await obtenerMesasPedidoModel(fechaHora);

    if (mesas.length === 0) {
        throw crearError('No se encontraron mesas disponibles.', 404);
    }

    return {
        ok: true,
        mesas
    };
};

const insertarPedidoService = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para insertar el pedido.', 400);
    }

    const { mesas, productos } = datos;

    if (!mesas || !Array.isArray(mesas) || mesas.length === 0) {
        throw crearError('Se necesita al menos una mesa.', 400);
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw crearError('Se necesita al menos un producto.', 400);
    }

    // Validar disponibilidad de mesas
    const ahora = new Date();

    for (const item of mesas) {
        if (!item.idMesa) {
            throw crearError('Cada mesa debe tener un idMesa válido.', 400);
        }

        const disponible = await validarMesaDisponibleModel(item.idMesa, ahora);
        if (!disponible) {
            throw crearError(`La mesa ${item.idMesa} no está disponible.`, 400);
        }
    }

    // Calcular precio total obteniendo cada producto
    let precio_precuenta = 0;

    for (const item of productos) {
        if (!item.idProducto || !item.cantidad || item.cantidad <= 0) {
            throw crearError('Se necesita un producto valido y cantidad válida.', 400);
        }

        const producto = await obtenerProductoIdModel(item.idProducto);

        if (!producto) {
            throw crearError('Producto especificado no valido', 404);
        }

        precio_precuenta += producto.precio_producto * item.cantidad;
    }

    // Extraer ids de mesas
    const idsMesas = mesas.map((m) => m.idMesa);

    // Formatear detalles para el modelo
    const detalles = productos.map((p) => ({
        id_producto: p.idProducto,
        cantidad: p.cantidad,
    }));

    // Insertar pedido en BD
    const resultado = await insertarPedidoCompletoModel(precio_precuenta, idsMesas, detalles);

    // Emitir evento a Pusher
    try {
        const numerosDesMesas = idsMesas.map(id => id);
        let textMesas = '';

        if (numerosDesMesas.length === 1) {
            textMesas = `mesa ${numerosDesMesas[0]}`;
        } else if (numerosDesMesas.length === 2) {
            textMesas = `mesas ${numerosDesMesas[0]} y ${numerosDesMesas[1]}`;
        } else {
            const todasMenos = numerosDesMesas.slice(0, -1).join(', ');
            textMesas = `mesas ${todasMenos} y ${numerosDesMesas[numerosDesMesas.length - 1]}`;
        }

        const payloadPusher = {
            tipo: 'agregar',
            id_pedido: resultado.id_pedido,
            mesas: idsMesas,
            titulo: `Se creó un pedido para la ${textMesas}`,
            timestamp: new Date().toISOString()
        };

        pusher.trigger('pedidos', 'pedido-creado', payloadPusher)
            .catch(err => {
                console.error('Error al emitir evento a Pusher:', err.message);
            });

    } catch (err) {
        console.error('Error en emisión de Pusher:', err.message);
    }

    return {
        ok: true,
        mensaje: 'Pedido registrado exitosamente',
        id_pedido: resultado.id_pedido,
    };
};

const listarPedidosService = async (fecha, hora) => {
    if (!fecha || typeof fecha !== 'string') {
        throw crearError('Se necesita una fecha válida.', 400);
    }

    if (!hora || typeof hora !== 'string') {
        throw crearError('Se necesita una hora válida.', 400);
    }

    const fechaHora = `${fecha} ${hora}:00`;

    if (isNaN(Date.parse(fechaHora))) {
        throw crearError('La fecha y hora proporcionadas no son válidas.', 400);
    }

    const pedidos = await listarPedidosModel(fechaHora);

    if (pedidos.length === 0) {
        throw crearError('No hay pedidos todavia.', 404);
    }

    // Por cada pedido obtener sus mesas y detalles
    const pedidosCompletos = await Promise.all(
        pedidos.map(async (pedido) => {
            const mesas = await listarMesasPorPedidoModel(pedido.id_pedido);
            const detalles = await listarDetallePorPedidoModel(pedido.id_pedido);

            return {
                ...pedido,
                mesas,
                detalles,
            };
        })
    );

    return {
        ok: true,
        pedidos: pedidosCompletos,
    };
};

const obtenerPedidoCompletoService = async (idPedido) => {

    if (!idPedido || isNaN(idPedido)) {
        throw crearError('Se necesita especificar un pedido válido.', 400);
    }

    const estadoPedido = await obtenerEstadoPedidoModel(idPedido);

    if (!estadoPedido || estadoPedido.length === 0) {
        throw crearError('No se encontró el pedido.', 404);
    }

    const detallePedido = await obtenerDetallePedidoModel(idPedido);
    const mesasPedido = await obtenerMesasDeUnPedidoModel(idPedido);

    return {
        ok: true,
        id_pedido: estadoPedido.id_pedido,
        estado_pedido: estadoPedido.estado_pedido,
        detalle: detallePedido.map(item => ({
            id_detalle_pedido: item.id_detalle_pedido,
            id_producto: item.id_producto,
            nombre_producto: item.nombre_producto,
            cantidad_pedido: item.cantidad_pedido
        })),
        mesas: mesasPedido.map(item => ({
            id_mesa: item.id_mesa,
            numero_mesa: item.numero_mesa
        }))
    };
};

const obtenerPedidoActivoMesaService = async (idMesa) => {
    if (!idMesa || isNaN(idMesa)) {
        throw crearError('Se necesita un idMesa válido.', 400);
    }

    const pedido = await obtenerUltimoPedidoMesaModel(idMesa);

    if (!pedido) {
        throw crearError('No hay pedido activo para esta mesa.', 404);
    }

    const detalle = await obtenerDetallePedidoModel(pedido.id_pedido);
    pedido.detalles = detalle;

    return {
        ok: true,
        pedido
    };
};

const editarPedidoService = async (idPedido, datos) => {

    if (!idPedido || isNaN(idPedido)) {
        throw crearError('Se necesita especificar un pedido válido.', 400);
    }

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para editar el pedido.', 400);
    }

    const { mesas, productos } = datos;

    if (!mesas || !Array.isArray(mesas) || mesas.length === 0) {
        throw crearError('Se necesita al menos una mesa.', 400);
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw crearError('Se necesita al menos un producto.', 400);
    }

    // Verificar que el pedido existe y está en estado pendiente
    const estadoPedido = await obtenerEstadoPedidoModel(idPedido);

    if (!estadoPedido || estadoPedido.length === 0) {
        throw crearError('No se encontró el pedido.', 404);
    }

    if (estadoPedido.estado_pedido !== 'pendiente') {
        throw crearError(`No se puede editar un pedido en estado "${estadoPedido.estado_pedido}". Solo se permiten pedidos pendientes.`, 409);
    }

    // Obtener mesas actuales del pedido para no revalidarlas como ocupadas
    const mesasActuales = await obtenerMesasDeUnPedidoModel(idPedido);
    const idsMesasActuales = new Set(mesasActuales.map((m) => m.id_mesa));

    // Validar disponibilidad solo de mesas nuevas (las que no pertenecen ya al pedido)
    const ahora = new Date();

    for (const item of mesas) {
        if (!item.idMesa) {
            throw crearError('Cada mesa debe tener un idMesa válido.', 400);
        }

        if (!idsMesasActuales.has(item.idMesa)) {
            const disponible = await validarMesaDisponibleModel(item.idMesa, ahora);
            if (!disponible) {
                throw crearError(`La mesa ${item.idMesa} no está disponible.`, 409);
            }
        }
    }

    // Calcular nuevo precio total
    let precio_precuenta = 0;

    for (const item of productos) {
        if (!item.idProducto || !item.cantidad || item.cantidad <= 0) {
            throw crearError('Se necesita un producto valido y cantidad válida.', 400);
        }

        const producto = await obtenerProductoIdModel(item.idProducto);

        if (!producto) {
            throw crearError('Producto especificado no valido', 404);
        }

        precio_precuenta += producto.precio_producto * item.cantidad;
    }

    const idsMesas = mesas.map((m) => m.idMesa);

    const detalles = productos.map((p) => ({
        id_producto: p.idProducto,
        cantidad: p.cantidad,
    }));

    await editarPedidoCompletoModel(idPedido, precio_precuenta, idsMesas, detalles);

    // Emitir evento a Pusher
    try {
        let textMesas = '';

        if (idsMesas.length === 1) {
            textMesas = `mesa ${idsMesas[0]}`;
        } else if (idsMesas.length === 2) {
            textMesas = `mesas ${idsMesas[0]} y ${idsMesas[1]}`;
        } else {
            const todasMenos = idsMesas.slice(0, -1).join(', ');
            textMesas = `mesas ${todasMenos} y ${idsMesas[idsMesas.length - 1]}`;
        }

        const payloadPusher = {
            tipo: 'editar',
            id_pedido: Number(idPedido),
            mesas: idsMesas,
            titulo: `Se editó el pedido para la ${textMesas}`,
            timestamp: new Date().toISOString()
        };

        pusher.trigger('pedidos', 'pedido-editado', payloadPusher)
            .catch(err => {
                console.error('Error al emitir evento a Pusher:', err.message);
            });

    } catch (err) {
        console.error('Error en emisión de Pusher:', err.message);
    }

    return {
        ok: true,
        mensaje: 'Pedido actualizado exitosamente',
        id_pedido: Number(idPedido),
    };
};

const cancelarPedidoService = async (idPedido) => {

    if (!idPedido || isNaN(idPedido)) {
        throw crearError('Se necesita especificar un pedido válido.', 400);
    }

    // Verificar que el pedido existe y está en estado pendiente
    const estadoPedido = await obtenerEstadoPedidoModel(idPedido);

    if (!estadoPedido || estadoPedido.length === 0) {
        throw crearError('No se encontró el pedido.', 404);
    }

    if (estadoPedido.estado_pedido !== 'pendiente') {
        throw crearError(`No se puede cancelar un pedido en estado "${estadoPedido.estado_pedido}". Solo se permiten pedidos pendientes.`, 409);
    }

    await cancelarPedidoModel(idPedido);

    // Emitir evento a Pusher
    try {
        const payloadPusher = {
            tipo: 'cancelar',
            id_pedido: Number(idPedido),
            titulo: `Se canceló el pedido #${idPedido}`,
            timestamp: new Date().toISOString()
        };

        pusher.trigger('pedidos', 'pedido-cancelado', payloadPusher)
            .catch(err => {
                console.error('Error al emitir evento a Pusher:', err.message);
            });

    } catch (err) {
        console.error('Error en emisión de Pusher:', err.message);
    }

    return {
        ok: true,
        mensaje: 'Pedido cancelado exitosamente',
        id_pedido: Number(idPedido),
    };
};

const completarPedidoService = async (idPedido) => {
    if (!idPedido || isNaN(idPedido)) {
        throw crearError('Se necesita especificar un pedido válido.', 400);
    }

    // Verificar que el pedido existe y está en estado pendiente
    const estadoPedido = await obtenerEstadoPedidoModel(idPedido);

    if (!estadoPedido || estadoPedido.length === 0) {
        throw crearError('No se encontró el pedido.', 404);
    }

    if (estadoPedido.estado_pedido !== 'pendiente') {
        throw crearError(`No se puede completar un pedido en estado "${estadoPedido.estado_pedido}". Solo se permiten pedidos pendientes.`, 409);
    }

    await completarPedidoModel(idPedido);

    // Emitir evento a Pusher
    try {
        const payloadPusher = {
            tipo: 'completar',
            id_pedido: Number(idPedido),
            titulo: `Se completó el pedido #${idPedido}`,
            timestamp: new Date().toISOString()
        };

        pusher.trigger('pedidos', 'pedido-completado', payloadPusher)
            .catch(err => {
                console.error('Error al emitir evento a Pusher:', err.message);
            });

    } catch (err) {
        console.error('Error en emisión de Pusher:', err.message);
    }

    return {
        ok: true,
        mensaje: 'Pedido completado exitosamente',
        id_pedido: Number(idPedido),
    };
};

module.exports = {
    obtenerMesasPedidoService,
    insertarPedidoService,
    listarPedidosService,
    obtenerPedidoCompletoService,
    obtenerPedidoActivoMesaService,
    editarPedidoService,
    cancelarPedidoService,
    completarPedidoService
};