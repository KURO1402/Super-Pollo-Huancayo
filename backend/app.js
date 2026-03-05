require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5671'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


const autenticacionRoutes = require('./src/modules/autenticacion/autenticacion_routes');
const usuarioRoutes = require('./src/modules/usuarios/usuario_routes');
const cajaRoutes = require('./src/modules/caja/caja_routes');
const insumosRoutes = require('./src/modules/inventario/insumos/insumo_routes');
const productosRoutes = require('./src/modules/inventario/productos/producto_routes');
const configuracionesRoutes = require('./src/modules/configuracion/configuracion_routes');
const reservacionRoutes = require('./src/modules/reservacion/reservacion_routes');
const ventasRoutes = require('./src/modules/ventas/ventas_routes');
const pedidosRoutes = require('./src/modules/pedidos/pedidos_routes');

app.get('/', (req, res) => {
  res.send("Super-pollo");
});

app.use('/api/auth', autenticacionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/insumos', insumosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api', configuracionesRoutes);
app.use('/api/reservaciones', reservacionRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
