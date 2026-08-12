const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const obtenerTipoComprobantePorIdRepository = async (idComprobante) => {
    const rows = await ejecutarSP(
        'sp_obtener_tipo_comprobante_por_id',
        [idComprobante],
        'Error al obtener el tipo de comprobante.'
    );
    return rows[0][0];
};

const actualizarCorrelativoComprobanteRepository = async (idComprobante, nuevoCorrelativo) => {
    const rows = await ejecutarSP(
        'sp_actualizar_correlativo_tipo_comprobante',
        [idComprobante, nuevoCorrelativo],
        'Error al actualizar el correlativo del comprobante.'
    );
    return rows[0];
};

const insertarTipoComprobanteRepository = async (nombreTipoComprobante, serie) => {
    const rows = await ejecutarSP(
        'sp_insertar_tipo_comprobante',
        [nombreTipoComprobante, serie],
        'Error al insertar el tipo de comprobante.'
    );
    return rows[0][0];
};

const contarTipoComprobantePorNombreSerieRepository = async (nombre, serie) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_comprobante_por_nombre_serie',
        [nombre, serie],
        'Error al contar los tipos de comprobante por nombre y serie.'
    );
    return rows[0][0]?.total;
};

const actualizarTipoComprobanteRepository = async (idTipoComprobante, nombreTipoComprobante, serie) => {
    const rows = await ejecutarSP(
        'sp_actualizar_tipo_comprobante',
        [idTipoComprobante, nombreTipoComprobante, serie],
        'Error al actualizar el tipo de comprobante.'
    );
    return rows[0][0];
};

const contarTipoComprobantePorIdRepository = async (idTipoComprobante) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_comprobante_por_id',
        [idTipoComprobante],
        'Error al contar el tipo de comprobante por id.'
    );
    return rows[0][0]?.total;
};

const contarTipoComprobanteNombreSerieExcluyendoIdRepository = async (nombreTipoComprobante, serie, idTipoComprobante) => {
    const rows = await ejecutarSP(
        'sp_contar_tipo_comprobante_nombre_serie_excluyendo_id',
        [nombreTipoComprobante, serie, idTipoComprobante],
        'Error al contar el tipo de comprobante por nombre y serie excluyendo id.'
    );
    return rows[0][0]?.total;
};

const eliminarTipoComprobanteRepository = async (idTipoComprobante) => {
    const rows = await ejecutarSP(
        'sp_eliminar_tipo_comprobante',
        [idTipoComprobante],
        'Error al eliminar el tipo de comprobante.'
    );
    return rows[0][0]?.mensaje;
};

const listarTiposComprobanteRepository = async () => {
    const rows = await ejecutarSP(
        'sp_listar_tipos_comprobante',
        [],
        'Error al listar los tipos de comprobante.'
    );
    return rows[0];
};

module.exports = {
    obtenerTipoComprobantePorIdRepository,
    actualizarCorrelativoComprobanteRepository,
    insertarTipoComprobanteRepository,
    contarTipoComprobantePorNombreSerieRepository,
    actualizarTipoComprobanteRepository,
    contarTipoComprobantePorIdRepository,
    contarTipoComprobanteNombreSerieExcluyendoIdRepository,
    eliminarTipoComprobanteRepository,
    listarTiposComprobanteRepository
};