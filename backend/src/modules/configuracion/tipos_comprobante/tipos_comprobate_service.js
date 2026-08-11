const crearError = require('../../../utilidades/crear_error');

const {
    insertarTipoComprobanteRepository,
    contarTipoComprobantePorNombreSerieRepository,
    actualizarTipoComprobanteRepository,
    contarTipoComprobantePorIdRepository,
    contarTipoComprobanteNombreSerieExcluyendoIdRepository,
    eliminarTipoComprobanteRepository,
    listarTiposComprobanteRepository
} = require('./tipos_comprobante_repository');

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

    const nombreSerieActivo = await contarTipoComprobantePorNombreSerieRepository(nombreComprobante, serie);
    if (nombreSerieActivo > 0) {
        throw crearError('Ya existe un tipo de comprobante activo con ese nombre o serie', 409);
    }

    const tipo_comprobante = await insertarTipoComprobanteRepository(nombreComprobante, serie);

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

    const existe = await contarTipoComprobantePorIdRepository(tipoComprobanteID);
    if (existe === 0) {
        throw crearError('El tipo de comprobante no existe', 404);
    }

    const nombreSerieDuplicado = await contarTipoComprobanteNombreSerieExcluyendoIdRepository(nombreComprobante, serie, tipoComprobanteID);
    if (nombreSerieDuplicado > 0) {
        throw crearError('Ya existe otro tipo de comprobante con ese nombre o serie', 409);
    }

    const tipoComprobanteActualizado = await actualizarTipoComprobanteRepository(tipoComprobanteID, nombreComprobante, serie);

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

    const tipoComprobanteExiste = await contarTipoComprobantePorIdRepository(tipoComprobanteID);
    if (tipoComprobanteExiste === 0) {
        throw crearError('El tipo de comprobante no existe', 404);
    }

    const resultado = await eliminarTipoComprobanteRepository(tipoComprobanteID);

    return {
        ok: true,
        mensaje: resultado
    };
};

const listarTiposComprobanteService = async () => {
    const tipos_comprobante = await listarTiposComprobanteRepository();

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