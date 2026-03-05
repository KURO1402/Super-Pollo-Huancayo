const crearError = require('../../utilidades/crear_error');
const { obtenerProductoIdModel } = require('../inventario/productos/producto_model');

const {
  obtenerMesasPedidoModel,
  insertarPedidoCompletoModel,
  listarPedidosModel,
  listarMesasPorPedidoModel,
  listarDetallePorPedidoModel,
  validarMesaDisponibleModel
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

    const resultado = await insertarPedidoCompletoModel(precio_precuenta, idsMesas, detalles);

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

module.exports = {
  obtenerMesasPedidoService,
  insertarPedidoService,
  listarPedidosService
}