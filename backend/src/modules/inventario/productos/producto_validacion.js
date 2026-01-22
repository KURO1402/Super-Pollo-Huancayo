const crearError = require('../../../utilidades/crear_error');

const validarDatosProducto = (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos del producto', 400);
    };

    const { nombreProducto, descripcionProducto, precioProducto, usaInsumos, insumos, idCategoria } = datos;

    if(!nombreProducto || typeof nombreProducto != 'string' || !nombreProducto.trim()){
        throw crearError('Se necesita el nombre del nuevo producto', 400);
    }

    if (!descripcionProducto || typeof descripcionProducto !== 'string' || !descripcionProducto.trim()) {
        throw crearError('Se necesita la descripcion del nuevo producto', 400);
    }

    if (typeof precioProducto !== 'number' || isNaN(precioProducto) || precioProducto <= 0) {
        throw crearError('Se necesita el precio del nuevo producto', 400);
    }

    if (usaInsumos === null || usaInsumos === undefined || typeof usaInsumos !== 'number' || ![0, 1].includes(usaInsumos)) {
        throw crearError('Especifique si el producto va a usar inventario de insumos', 400);
    }

    if (usaInsumos === 1) {
        if (!insumos || !Array.isArray(insumos) || insumos.length === 0) { 
            throw crearError('Al activar inventario de insumos, debe especificar los insumos y cantidad de uso correspondientes.', 400); 
        }
        insumos.forEach((insumo) => {
            if(!insumo || typeof insumo !== 'object' || typeof insumo.idInsumo !== 'number'|| insumo.idInsumo <= 0 || typeof insumo.idInsumo !== 'number' ||  insumo.cantidadUso <=  0){
                throw crearError('Se necesitan que especifique cada insumo y su cantidad de uso', 400);
            }
        });
    }

    if(!idCategoria || typeof idCategoria !== 'number'){
        throw crearError('Se necesita la categoria del nuevo producto.', 400);
    }
};

module.exports = {
    validarDatosProducto
}