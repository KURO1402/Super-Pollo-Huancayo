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
  obtenerMesasDeUnPedidoModel
} = require('./pedidos_model')

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
  }
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

    // ==========================================
    // EMITIR EVENTO A PUSHER
    // ==========================================
    try {
        // Generar texto de mesas (Ej: "mesa 1 y 7" o "mesas 6, 1 y 3")
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

        // Crear payload para Pusher
        const payloadPusher = {
            tipo: 'agregar',
            id_pedido: resultado.id_pedido,
            mesas: idsMesas,
            titulo: `Se creó un pedido para la ${textMesas}`,
            timestamp: new Date().toISOString()
        };

        // Enviar evento a Pusher (sin esperar respuesta - es async)
        pusher.trigger('pedidos', 'pedido-creado', payloadPusher)
            .catch(err => {
                console.error('Error al emitir evento a Pusher:', err.message);
                // No relanzamos el error para que el pedido se cree igual
            });

    } catch (err) {
        console.error('Error en emisión de Pusher:', err.message);
        // No relanzamos el error para que el pedido se cree igual
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

module.exports = {
  obtenerMesasPedidoService,
  insertarPedidoService,
  listarPedidosService,
  obtenerPedidoCompletoService
}