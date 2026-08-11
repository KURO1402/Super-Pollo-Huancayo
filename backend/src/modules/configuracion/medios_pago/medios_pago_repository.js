const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const insertarMedioPagoRepository = async (nombreMedioPago) => {
    const rows = await ejecutarSP(
        'sp_insertar_medio_pago',
        [nombreMedioPago],
        'Error al insertar el medio de pago.'
    );
    return rows[0][0];
};

const contarMedioPagoPorNombreRepository = async (nombre) => {
    const rows = await ejecutarSP(
        'sp_contar_medio_pago_por_nombre',
        [nombre],
        'Error al contar los medios de pago por nombre.'
    );
    return rows[0][0]?.total;
};

const actualizarMedioPagoRepository = async (idMedioPago, nombreMedioPago) => {
    const rows = await ejecutarSP(
        'sp_actualizar_medio_pago',
        [idMedioPago, nombreMedioPago],
        'Error al actualizar el medio de pago.'
    );
    return rows[0][0];
};

const contarMedioPagoPorIdRepository = async (idMedioPago) => {
    const rows = await ejecutarSP(
        'sp_contar_medio_pago_por_id',
        [idMedioPago],
        'Error al contar el medio de pago por id.'
    );
    return rows[0][0]?.total;
};

const contarMedioPagoNombreExcluyendoIdRepository = async (nombreMedioPago, idMedioPago) => {
    const rows = await ejecutarSP(
        'sp_contar_medio_pago_nombre_excluyendo_id',
        [nombreMedioPago, idMedioPago],
        'Error al contar el medio de pago por nombre excluyendo id.'
    );
    return rows[0][0]?.total;
};

const eliminarMedioPagoRepository = async (idMedioPago) => {
    const rows = await ejecutarSP(
        'sp_eliminar_medio_pago',
        [idMedioPago],
        'Error al eliminar el medio de pago.'
    );
    return rows[0][0]?.mensaje;
};

const listarMediosPagoRepository = async () => {
    const rows = await ejecutarSP(
        'sp_listar_medios_pago',
        [],
        'Error al listar los medios de pago.'
    );
    return rows[0];
};

const obtenerMedioPagoPorIdRepository = async (idMedioPago) => {
    const rows = await ejecutarSP(
        'sp_obtener_medio_pago_por_id',
        [idMedioPago],
        'Error al obtener el medio de pago por id.'
    );
    return rows[0][0];
};

module.exports = {
    insertarMedioPagoRepository,
    contarMedioPagoPorNombreRepository,
    actualizarMedioPagoRepository,
    contarMedioPagoPorIdRepository,
    contarMedioPagoNombreExcluyendoIdRepository,
    eliminarMedioPagoRepository,
    listarMediosPagoRepository,
    obtenerMedioPagoPorIdRepository
};