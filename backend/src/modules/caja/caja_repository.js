const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const crearCajaRepository = async (montoInicial, usuarioId) => {
    const rows = await ejecutarSP(
        'sp_crear_caja_con_evento',
        [montoInicial, usuarioId],
        'Error al crear la caja.'
    );
    return rows[0][0];
};

const cerrarCajaRepository = async (cajaId, usuarioId, montoFinal) => {
    const rows = await ejecutarSP(
        'sp_cerrar_caja_registrar_evento',
        [cajaId, usuarioId, montoFinal],
        'Error al cerrar la caja.'
    );
    return rows[0][0]?.mensaje;
};

const consultarCajaAbiertaRepository = async () => {
    const rows = await ejecutarSP(
        'sp_consultar_caja_abierta',
        [],
        'Error al consultar la caja abierta.'
    );
    return rows[0][0];
};

const registrarIngresoCajaRepository = async (monto, descripcion, usuarioId, ventaId = null) => {
    const rows = await ejecutarSP(
        'sp_registrar_ingreso_caja',
        [monto, descripcion, usuarioId, ventaId],
        'Error al registrar el ingreso en caja.'
    );
    return rows[0][0];
};

const registrarEgresoCajaRepository = async (monto, descripcion, usuarioId) => {
    const rows = await ejecutarSP(
        'sp_registrar_egreso_caja',
        [monto, descripcion, usuarioId],
        'Error al registrar el egreso en caja.'
    );
    return rows[0][0];
};

const registrarArqueoCajaRepository = async (montos, diferencia, estadoArqueo, idUsuario, idCaja, descripcionArqueo = null) => {
    const { montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros } = montos;

    const rows = await ejecutarSP(
        'sp_registrar_arqueo_caja',
        [idUsuario, idCaja, montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros, diferencia, estadoArqueo, descripcionArqueo],
        'Error al registrar el arqueo de caja.'
    );
    return rows[0][0]?.mensaje;
};

const contarCajasRepository = async (fechaInicio = null, fechaFin = null) => {
    const rows = await ejecutarSP(
        'sp_contar_cajas',
        [fechaInicio, fechaFin],
        'Error al contar las cajas.'
    );
    return rows[0][0]?.total_registros;
};

const obtenerCajasRepository = async (limit, offset, fechaInicio = null, fechaFin = null) => {
    const rows = await ejecutarSP(
        'sp_listar_cajas',
        [limit, offset, fechaInicio, fechaFin],
        'Error al listar las cajas.'
    );
    return rows[0];
};

const obtenerMovimientosPorCajaRepository = async (cajaId, tipoMovimiento = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_movimientos_por_caja',
        [cajaId, tipoMovimiento, limit, offset],
        'Error al obtener los movimientos de la caja.'
    );
    return rows[0];
};

const contarMovimientosPorCajaRepository = async (cajaId, tipoMovimiento = null) => {
    const rows = await ejecutarSP(
        'sp_contar_movimientos_por_caja',
        [cajaId, tipoMovimiento],
        'Error al contar los movimientos de la caja.'
    );
    return rows[0][0]?.total_registros;
};

const obtenerArqueosPorCajaRepository = async (cajaId) => {
    const rows = await ejecutarSP(
        'sp_obtener_arqueos_por_caja',
        [cajaId],
        'Error al obtener los arqueos de la caja.'
    );
    return rows[0];
};

const obtenerCajaActualRepository = async () => {
    const rows = await ejecutarSP(
        'sp_obtener_caja_actual',
        [],
        'Error al obtener la caja actual.'
    );
    return rows[0][0] || null;
};

module.exports = {
    crearCajaRepository,
    cerrarCajaRepository,
    consultarCajaAbiertaRepository,
    registrarIngresoCajaRepository,
    registrarEgresoCajaRepository,
    registrarArqueoCajaRepository,
    contarCajasRepository,
    obtenerCajasRepository,
    obtenerMovimientosPorCajaRepository,
    contarMovimientosPorCajaRepository,
    obtenerArqueosPorCajaRepository,
    obtenerCajaActualRepository
};