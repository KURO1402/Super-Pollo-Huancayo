const { ejecutarSP } = require('../../../utilidades/helpers/db_helper');

const insertarInsumoRepository = async (nombreInsumo, stockIncial, unidadMedida, idUsuario) => {
    const rows = await ejecutarSP(
        'sp_insertar_insumo',
        [nombreInsumo, stockIncial, unidadMedida, idUsuario],
        'Error al insertar el insumo.'
    );
    return rows[0][0];
};

const contarInsumosPorNombreRepository = async (nombreInsumo) => {
    const rows = await ejecutarSP(
        'sp_contar_insumos_por_nombre',
        [nombreInsumo],
        'Error al contar los insumos por nombre.'
    );
    return rows[0][0];
};

const recuperarInsumoRepository = async (idInsumo, unidadMedida, estadoInsumo, stockInsumo, idUsuario) => {
    const rows = await ejecutarSP(
        'sp_recuperar_insumo',
        [idInsumo, unidadMedida, estadoInsumo, stockInsumo, idUsuario],
        'Error al recuperar el insumo.'
    );
    return rows[0][0];
};

const actualizarDatosInsumoRepository = async (idInsumo, nombreInsumo, unidadMedida) => {
    const rows = await ejecutarSP(
        'sp_actualizar_insumo_datos',
        [idInsumo, nombreInsumo, unidadMedida],
        'Error al actualizar los datos del insumo.'
    );
    return rows[0][0];
};

const actualizarEstadoInsumoRepository = async (idInsumo, estadoInsumo) => {
    const rows = await ejecutarSP(
        'sp_actualizar_estado_insumo',
        [idInsumo, estadoInsumo],
        'Error al actualizar el estado del insumo.'
    );
    return rows[0][0]?.mensaje;
};

const contarInsumosPorIdRepository = async (idInsumo) => {
    const rows = await ejecutarSP(
        'sp_contar_insumo_por_id',
        [idInsumo],
        'Error al contar el insumo por id.'
    );
    return rows[0][0]?.total;
};

const contarInsumosPorNombre2Repository = async (nombreInsumo, idInsumo) => {
    const rows = await ejecutarSP(
        'sp_contar_insumos_por_nombre_2',
        [nombreInsumo, idInsumo],
        'Error al contar los insumos por nombre.'
    );
    return rows[0][0]?.total;
};

const obtenerInsumosRepository = async (limit, offset, nombreInsumo = null, nivelStock = null) => {
    const rows = await ejecutarSP(
        'sp_obtener_insumos',
        [limit, offset, nombreInsumo, nivelStock],
        'Error al obtener los insumos.'
    );
    return rows[0];
};

const contarInsumosRepository = async (nombreInsumo = null, nivelStock = null) => {
    const rows = await ejecutarSP(
        'sp_contar_insumos',
        [nombreInsumo, nivelStock],
        'Error al contar los insumos.'
    );
    return rows[0][0]?.total_registros;
};

const obtenerInsumoIDRepository = async (id) => {
    const rows = await ejecutarSP(
        'sp_obtener_insumo_por_id',
        [id],
        'Error al obtener el insumo.'
    );
    return rows[0][0];
};

const obtenerStockActualRepository = async (idInsumo) => {
    const rows = await ejecutarSP(
        'sp_optener_stock_actual_insumo',
        [idInsumo],
        'Error al obtener el stock del insumo.'
    );
    return rows[0][0]?.stock_insumo;
};

const registrarMovimientoStockRepository = async (idInsumo, cantidad, tipoMovimiento, detalleMovimiento, idUsuario) => {
    const rows = await ejecutarSP(
        'sp_registrar_movimiento_stock',
        [idInsumo, cantidad, tipoMovimiento, detalleMovimiento, idUsuario],
        'Error al registrar el movimiento de stock.'
    );
    return rows[0][0];
};

const contarMovimientosStockFiltrosRepository = async (fechaInicio = null, fechaFin = null, tipoMovimiento = null, idInsumo = null) => {
    const rows = await ejecutarSP(
        'sp_contar_movimientos_stock_filtros',
        [fechaInicio, fechaFin, tipoMovimiento, idInsumo],
        'Error al contar los movimientos de stock.'
    );
    return rows[0][0]?.total_registros;
};

const obtenerMovimientosStockFiltrosRepository = async (fechaInicio = null, fechaFin = null, tipoMovimiento = null, idInsumo = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_movimientos_stock_filtros',
        [fechaInicio, fechaFin, tipoMovimiento, idInsumo, limit, offset],
        'Error al obtener los movimientos de stock.'
    );
    return rows[0];
};

module.exports = {
    insertarInsumoRepository,
    contarInsumosPorNombreRepository,
    recuperarInsumoRepository,
    actualizarDatosInsumoRepository,
    actualizarEstadoInsumoRepository,
    contarInsumosPorIdRepository,
    contarInsumosPorNombre2Repository,
    obtenerInsumosRepository,
    contarInsumosRepository,
    obtenerInsumoIDRepository,
    obtenerStockActualRepository,
    registrarMovimientoStockRepository,
    contarMovimientosStockFiltrosRepository,
    obtenerMovimientosStockFiltrosRepository
};