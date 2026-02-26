const crearError = require('../../utilidades/crear_error');
const validarDatosVenta = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para generar la venta', 400);
    }

    const { tipoComprobante, medioPago, cliente, productos } = datos;

    if (!tipoComprobante || typeof tipoComprobante !== 'number') {
        throw crearError('Se necesita especificar tipo de comprobante', 400);
    }
    if(!medioPago || typeof medioPago !== 'number') {
        throw crearError('Se necesita especificar el medio de pago', 400);
    }
    
    if (!cliente || typeof cliente !== 'object') {
        throw crearError('Se necesita los datos del cliente', 400);
    }

    const { idTipoDoc, numDoc, denominacionCliente } = cliente;

    if (!idTipoDoc || typeof idTipoDoc !== 'number') {
        throw crearError('Se necesita especificar el tipo de documento del cliente', 400);
    }

    if (!numDoc || typeof numDoc !== 'number') {
        throw crearError('El número de documento debe ser numérico', 400);
    }

    if (!denominacionCliente || typeof denominacionCliente !== 'string') {
        throw crearError('Se necesita la denominación del cliente', 400);
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw crearError('Se necesita especificar 1 o mas productos', 400);
    }

    productos.forEach((producto) => {
        if (!producto || typeof producto !== 'object') {
            throw crearError('Especifique un producto valido', 400);
        }

        const { idProducto, cantidad } = producto;

        if (!idProducto || typeof idProducto !== 'number') {
            throw crearError('Especifique un producto valido', 400);
        }

        if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
            throw crearError('Se neceita especificar la cantidad del producto', 400);
        }
    });
};

module.exports = {
    validarDatosVenta
}