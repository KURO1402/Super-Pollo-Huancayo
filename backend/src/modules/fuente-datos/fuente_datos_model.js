const pool = require('../../config/conexion_DB');

const obtenerResumenVentasEgresosMensualModel = async (cantidadMeses) => {
  let conexion;
  try {
      conexion = await pool.getConnection();
      const [result] = await conexion.execute(
          'CALL sp_resumen_ventas_egresos_mensual(?)', 
          [cantidadMeses]
      );
      return result[0];
  } catch (err) {
      console.log(err.message);
      throw new Error('Error al obtener el resumen de ventas y egresos');
  } finally {
      if (conexion) conexion.release();
  }
};

const obtenerVentasHoyComparacionModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_ventas_hoy_comparacion()');
        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener ventas de hoy');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerReservasMesComparacionModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_reservas_mes_comparacion()');
        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener reservas del mes');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerBalanceAnualModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_balance_general_anual()');
        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener el balance anual');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerPorcentajeMediosPagoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_porcentaje_medios_pago()');
        return result[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener porcentaje de medios de pago');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerVentasPorMesModel = async (cantidadMeses) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_ventas_por_mes(?)', [cantidadMeses]);
        return result[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener ventas por mes');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerTopProductosMasVendidosModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            'CALL sp_top_productos_mas_vendidos(?, ?)',
            [fechaInicio, fechaFin]
        );
        return result[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener top productos más vendidos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = { 
    obtenerResumenVentasEgresosMensualModel,
    obtenerVentasHoyComparacionModel,
    obtenerReservasMesComparacionModel,
    obtenerBalanceAnualModel,
    obtenerPorcentajeMediosPagoModel,
    obtenerVentasPorMesModel,
    obtenerTopProductosMasVendidosModel 
};