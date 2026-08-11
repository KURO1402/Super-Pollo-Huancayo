const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const insertarTipoDocumentoRepository = async (nombreTipoDocumento) => {
    const rows = await ejecutarSP(
        'sp_insertar_tipo_documento',
        [nombreTipoDocumento],
        'Error al insertar el tipo de documento.'
    );
    return rows[0][0];
};

const contarTipoDocumentoPorNombreRepository = async (nombre) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_documento_por_nombre',
        [nombre],
        'Error al contar los tipos de documento por nombre.'
    );
    return rows[0][0]?.total;
};

const actualizarTipoDocumentoRepository = async (idTipoDocumento, nombreTipoDocumento) => {
    const rows = await ejecutarSP(
        'sp_actualizar_tipo_documento',
        [idTipoDocumento, nombreTipoDocumento],
        'Error al actualizar el tipo de documento.'
    );
    return rows[0][0];
};

const contarTipoDocumentoPorIdRepository = async (idTipoDocumento) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_documento_por_id',
        [idTipoDocumento],
        'Error al contar el tipo de documento por id.'
    );
    return rows[0][0]?.total;
};

const contarTipoDocumentoNombreExcluyendoIdRepository = async (nombreTipoDocumento, idTipoDocumento) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_documento_nombre_excluyendo_id',
        [nombreTipoDocumento, idTipoDocumento],
        'Error al contar el tipo de documento por nombre excluyendo id.'
    );
    return rows[0][0]?.total;
};

const eliminarTipoDocumentoRepository = async (idTipoDoc) => {
    const rows = await ejecutarSP(
        'sp_eliminar_tipo_documento',
        [idTipoDoc],
        'Error al eliminar el tipo de documento.'
    );
    return rows[0][0]?.mensaje;
};

const listarTiposDocumentoRepository = async () => {
    const rows = await ejecutarSP(
        'sp_listar_tipos_documento',
        [],
        'Error al listar los tipos de documento.'
    );
    return rows[0];
};

const obtenerTipoDocumentoPorIdRepository = async (idTipoDocumento) => {
    const rows = await ejecutarSP(
        'sp_obtener_tipo_documento_por_id',
        [idTipoDocumento],
        'Error al obtener el tipo de documento por id.'
    );
    return rows[0][0];
};

module.exports = {
    insertarTipoDocumentoRepository,
    contarTipoDocumentoPorNombreRepository,
    actualizarTipoDocumentoRepository,
    contarTipoDocumentoPorIdRepository,
    contarTipoDocumentoNombreExcluyendoIdRepository,
    eliminarTipoDocumentoRepository,
    listarTiposDocumentoRepository,
    obtenerTipoDocumentoPorIdRepository
};