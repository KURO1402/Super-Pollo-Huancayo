const { obtenerTipoComprobantePorIdModel } = require('../configuracion/tipos_comprobante/tipos_comprobante_model');
const { obtenerTipoDocumentoPorIdModel } = require('../configuracion/tipos_documento/tipos_documento_model');
const { obtenerProductoIdModel } = require('../inventario/productos/producto_model');
const crearError = require('../../utilidades/crear_error');
const obtenerFechaActual = require('../../utilidades/obtener_fecha_actual');
const { company, IGV, TIPO_COMPROBANTE_CODIGO, TIPO_DOCUMENTO_CODIGO } = require('../../utilidades/helpers/constantes_venta');
const numeroALetras = require('../../utilidades/numero_letras');

 

const validarDocumentoPorTipo = (nombreDoc, nroDoc) => {
    if (nombreDoc === 'ruc') {
        if (!/^\d{11}$/.test(nroDoc))
            throw crearError('El RUC debe tener exactamente 11 dígitos numéricos', 400);

    } else if (nombreDoc === 'dni') {
        if (!/^\d{8}$/.test(nroDoc))
            throw crearError('El DNI debe tener exactamente 8 dígitos numéricos', 400);

    } else if (nombreDoc === 'pasaporte') {
        if (!nroDoc || nroDoc.length < 6 || nroDoc.length > 12)
            throw crearError('El pasaporte debe tener entre 6 y 12 caracteres', 400);

    } else if (nombreDoc === 'carnet de extranjeria' || nombreDoc === 'carnet de extranjería') {
        if (!/^\d{9}$/.test(nroDoc))
            throw crearError('El carnet de extranjería debe tener exactamente 9 dígitos', 400);
    }
};

const calcularProducto = (productoExiste, cantidad) => {
    const precioConIgv = parseFloat(productoExiste.precio_producto);
    const precioSinIgv = parseFloat((precioConIgv / (1 + IGV)).toFixed(2));
    const igvUnitario = parseFloat((precioConIgv - precioSinIgv).toFixed(2));
    const totalLinea = parseFloat((precioSinIgv * cantidad).toFixed(2));
    const igvLinea = parseFloat((igvUnitario * cantidad).toFixed(2));

    return {
        idProducto: productoExiste.id_producto,
        codProducto: `P${String(productoExiste.id_producto).padStart(3, '0')}`,
        unidad: "NIU",
        descripcion: productoExiste.nombre_producto,
        cantidad,
        mtoValorUnitario: precioSinIgv,
        mtoPrecioUnitario: precioConIgv,
        igv: igvLinea,
        mtoValorVenta: totalLinea,
        totalImpuestos: igvLinea,
    };
};

// Función principal 

const generarDatosComprobante = async (tipoComprobante, cliente, productos) => {

    // Validar tipo de comprobante
    const tipoComprobanteExiste = await obtenerTipoComprobantePorIdModel(tipoComprobante);
    if (!tipoComprobanteExiste)
        throw crearError('Tipo de comprobante no valido', 400);

    // Validar tipo de documento
    const tipoDocumentoExiste = await obtenerTipoDocumentoPorIdModel(cliente.idTipoDoc);
    if (!tipoDocumentoExiste)
        throw crearError('Tipo de documento no valido', 400);

    const nombreComprobante = tipoComprobanteExiste.nombre_tipo_comprobante.toLowerCase();
    const nombreDoc = tipoDocumentoExiste.nombre_tipo_documento.toLowerCase();
    const nroDoc = cliente.numDoc.toString().trim();

    // Validaciones específicas para factura
    if (nombreComprobante === 'factura') {
        if (nombreDoc !== 'ruc')
            throw crearError('Para factura el tipo de documento debe ser RUC', 400);

        if (!cliente.direccionCliente || cliente.direccionCliente.trim() === '')
            throw crearError('Para factura se requiere la dirección del cliente', 400);
    }

    // Validar formato del número de documento
    validarDocumentoPorTipo(nombreDoc, nroDoc);

    // Procesar productos
    const productosDetalle = await Promise.all(
        productos.map(async ({ idProducto, cantidad }) => {
            const productoExiste = await obtenerProductoIdModel(idProducto);
            if (!productoExiste)
                throw crearError(`Producto con id ${idProducto} no encontrado`, 400);

            return calcularProducto(productoExiste, cantidad);
        })
    );

    // Calcular totales
    const mtoOperGravadas = parseFloat(productosDetalle.reduce((acc, p) => acc + p.mtoValorVenta, 0).toFixed(2));
    const totalIgv = parseFloat(productosDetalle.reduce((acc, p) => acc + p.igv, 0).toFixed(2));
    const mtoImpVenta = parseFloat((mtoOperGravadas + totalIgv).toFixed(2));
    

    const fecha = obtenerFechaActual();

    return {
        ublVersion: "2.1",
        fecVencimiento: fecha,
        tipoOperacion: "0101",
        tipoDoc: TIPO_COMPROBANTE_CODIGO[nombreComprobante],
        serie: tipoComprobanteExiste.serie,
        correlativo: tipoComprobanteExiste.correlativo + 1,
        fechaEmision: fecha,
        formaPago: {
            moneda: "PEN",
            tipo: "Contado"
        },
        tipoMoneda: "PEN",
        client: {
            tipoDoc: TIPO_DOCUMENTO_CODIGO[nombreDoc],
            numDoc: cliente.numDoc,
            rznSocial: cliente.denominacionCliente,
            address: {
                direccion: cliente.direccionCliente?.trim() || "Direccion cliente"
            }
        },
        company,
        mtoOperGravadas,
        totalIgv,
        mtoImpVenta,
        details: productosDetalle,
        legends: [
            { value: numeroALetras(mtoImpVenta) }
        ]
    };
};

module.exports = { generarDatosComprobante };