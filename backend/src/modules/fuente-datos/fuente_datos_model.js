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

module.exports = { obtenerResumenVentasEgresosMensualModel };