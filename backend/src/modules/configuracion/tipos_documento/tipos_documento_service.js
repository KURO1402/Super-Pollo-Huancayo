const crearError = require('../../../utilidades/crear_error');

const {
    insertarTipoDocumentoRepository,
    contarTipoDocumentoPorNombreRepository,
    actualizarTipoDocumentoRepository,
    contarTipoDocumentoPorIdRepository,
    contarTipoDocumentoNombreExcluyendoIdRepository,
    eliminarTipoDocumentoRepository,
    listarTiposDocumentoRepository,
    obtenerTipoDocumentoPorIdRepository
} = require('./tipos_documento_repository');

const insertarTipoDocumentoService = async (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos para crear un nuevo tipo de documento', 400); 
    }

    const { nombreDocumento } = datos;

    if(!nombreDocumento || typeof nombreDocumento !== 'string' || !nombreDocumento.trim()) {
        throw crearError('Se necesita el nombre de el nuevo tipo de documento', 400);
    }

    const nombreCoincidente = await contarTipoDocumentoPorNombreRepository(nombreDocumento);
    if(nombreCoincidente > 0) {
        throw crearError('Ya existe un tipo de documento con ese nombre', 409);
    }

    const tipo_documento = await insertarTipoDocumentoRepository(nombreDocumento);

    return {
        ok: true,
        mensaje: 'Tipo de documento insertado correctamente',
        tipo_documento
    }
};

const actualizarTipoDocumentoService = async (datos, idTipoDocumento) => {

    if (!idTipoDocumento.trim() || isNaN(Number(idTipoDocumento))) {
        throw crearError('ID de tipo de documento no válido', 400);
    }
    const tipoDocumentoID = Number(idTipoDocumento);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para actualizar el tipo de documento', 400);
    }

    const { nombreDocumento } = datos;

    if (!nombreDocumento || typeof nombreDocumento !== 'string' || !nombreDocumento.trim()) {
        throw crearError('El nombre del tipo de documento es obligatorio', 400);
    }
    const existe = await contarTipoDocumentoPorIdRepository(tipoDocumentoID);
    if (existe === 0) {
        throw crearError('El tipo de documento no existe', 404);
    }

    const nombreDuplicado = await contarTipoDocumentoNombreExcluyendoIdRepository(nombreDocumento, tipoDocumentoID);
    if (nombreDuplicado > 0) {
        throw crearError('Ya existe otro tipo de documento con ese nombre', 409);
    }

    const tipoDocumentoActualizado = await actualizarTipoDocumentoRepository(tipoDocumentoID, nombreDocumento);

    return {
        ok: true,
        mensaje: 'Tipo de documento actualizado correctamente',
        tipoDocumento: tipoDocumentoActualizado
    };
};

const eliminarTipoDocumentoService = async (idTipoDoc) => {
    if (!idTipoDoc.trim() || isNaN(Number(idTipoDoc))) {
        throw crearError('ID de tipo de documento no válido', 400);
    }

    const tipodDocID = Number(idTipoDoc);

    const tipoDocExiste = await contarTipoDocumentoPorIdRepository(tipodDocID);

    if( tipoDocExiste === 0 ) {
        throw crearError('El tipo de documento no existe', 404);
    }

    const resultado = await eliminarTipoDocumentoRepository(tipodDocID);

    return {
        ok: true,
        mensaje: resultado
    }
};

const listarTiposDocumentoService = async () => {

    const tipos_documento = await listarTiposDocumentoRepository();

    if (!tipos_documento || tipos_documento.length === 0) {
        throw crearError('No se encontraron tipos de documento', 404);
    }

    return {
        ok: true,
        tipos_documento
    };
};

const obtenerTipoDocumentoPorIdService = async (idTipoDocumento) => {

    if (!idTipoDocumento || isNaN(Number(idTipoDocumento))) {
        throw crearError('Tipo de documento no valido', 400);
    }

    const tipoDocumentoID = Number(idTipoDocumento);
    const tipo_documento = await obtenerTipoDocumentoPorIdRepository(tipoDocumentoID);

    if (!tipo_documento) {
        throw crearError('Tipo de documento no encontrado', 404);
    }

    return {
        ok: true,
        tipo_documento
    };
};

module.exports = {
    insertarTipoDocumentoService,
    actualizarTipoDocumentoService,
    eliminarTipoDocumentoService,
    listarTiposDocumentoService,
    obtenerTipoDocumentoPorIdService 
}