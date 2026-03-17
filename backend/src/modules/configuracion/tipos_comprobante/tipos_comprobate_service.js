const crearError = require('../../../utilidades/crear_error');

const {
    insertarTipoComprobanteModel,
    contarTipoComprobantePorNombreSerieModel,
    actualizarTipoComprobanteModel,
    contarTipoComprobantePorIdModel,
    contarTipoComprobanteNombreSerieExcluyendoIdModel,
    eliminarTipoComprobanteModel,
    listarTiposComprobanteModel
} = require('./tipos_comprobante_model');

const insertarTipoComprobanteService = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para crear un nuevo tipo de comprobante', 400);
    }

    const { nombreComprobante, serie } = datos;

    if (!nombreComprobante || typeof nombreComprobante !== 'string' || !nombreComprobante.trim()) {
        throw crearError('Se necesita el nombre del nuevo tipo de comprobante', 400);
    }

    if (!serie || typeof serie !== 'string' || !serie.trim()) {
        throw crearError('Se necesita la serie del nuevo tipo de comprobante', 400);
    }

    const nombreSerieActivo = await contarTipoComprobantePorNombreSerieModel(nombreComprobante, serie);
    if (nombreSerieActivo > 0) {
        throw crearError('Ya existe un tipo de comprobante activo con ese nombre o serie', 409);
    }

    const tipo_comprobante = await insertarTipoComprobanteModel(nombreComprobante, serie);

    return {
        ok: true,
        mensaje: 'Tipo de comprobante registrado correctamente',
        tipo_comprobante
    };
};

const actualizarTipoComprobanteService = async (datos, idTipoComprobante) => {
    if (!idTipoComprobante.trim() || isNaN(Number(idTipoComprobante))) {
        throw crearError('ID de tipo de comprobante no válido', 400);
    }

    const tipoComprobanteID = Number(idTipoComprobante);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para actualizar el tipo de comprobante', 400);
    }

    const { nombreComprobante, serie } = datos;

    if (!nombreComprobante || typeof nombreComprobante !== 'string' || !nombreComprobante.trim()) {
        throw crearError('El nombre del tipo de comprobante es obligatorio', 400);
    }

    if (!serie || typeof serie !== 'string' || !serie.trim()) {
        throw crearError('La serie del tipo de comprobante es obligatoria', 400);
    }

    const existe = await contarTipoComprobantePorIdModel(tipoComprobanteID);
    if (existe === 0) {
        throw crearError('El tipo de comprobante no existe', 404);
    }

    const nombreSerieDuplicado = await contarTipoComprobanteNombreSerieExcluyendoIdModel(nombreComprobante, serie, tipoComprobanteID);
    if (nombreSerieDuplicado > 0) {
        throw crearError('Ya existe otro tipo de comprobante con ese nombre o serie', 409);
    }

    const tipoComprobanteActualizado = await actualizarTipoComprobanteModel(tipoComprobanteID, nombreComprobante, serie);

    return {
        ok: true,
        mensaje: 'Tipo de comprobante actualizado correctamente',
        tipoComprobante: tipoComprobanteActualizado
    };
};

const eliminarTipoComprobanteService = async (idTipoComprobante) => {
    if (!idTipoComprobante.trim() || isNaN(Number(idTipoComprobante))) {
        throw crearError('ID de tipo de comprobante no válido', 400);
    }

    const tipoComprobanteID = Number(idTipoComprobante);

    const tipoComprobanteExiste = await contarTipoComprobantePorIdModel(tipoComprobanteID);
    if (tipoComprobanteExiste === 0) {
        throw crearError('El tipo de comprobante no existe', 404);
    }

    const resultado = await eliminarTipoComprobanteModel(tipoComprobanteID);

    return {
        ok: true,
        mensaje: resultado
    };
};

const listarTiposComprobanteService = async () => {
    const tipos_comprobante = await listarTiposComprobanteModel();

    if (!tipos_comprobante || tipos_comprobante.length === 0) {
        throw crearError('No se encontraron tipos de comprobante', 404);
    }

    return {
        ok: true,
        tipos_comprobante
    };
};

module.exports = {
    insertarTipoComprobanteService,
    actualizarTipoComprobanteService,
    eliminarTipoComprobanteService,
    listarTiposComprobanteService
};