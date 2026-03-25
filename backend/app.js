require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.set('trust proxy', 1);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, por favor intenta más tarde.' }
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 20, 
  message: { error: 'Muchos intentos de acceso. Intenta en una hora.' }
});
app.use('/api/auth', authLimiter);

const corsOptions = {
  origin: [CLIENT_URL || 'https://superpollohyo.com'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const autenticacionRoutes = require('./src/modules/autenticacion/autenticacion_routes');
const usuarioRoutes = require('./src/modules/usuarios/usuario_routes');
const cajaRoutes = require('./src/modules/caja/caja_routes');
const insumosRoutes = require('./src/modules/inventario/insumos/insumo_routes');
const productosRoutes = require('./src/modules/inventario/productos/producto_routes');
const configuracionesRoutes = require('./src/modules/configuracion/configuracion_routes');
const reservacionRoutes = require('./src/modules/reservacion/reservacion_routes');
const ventasRoutes = require('./src/modules/ventas/ventas_routes');
const pedidosRoutes = require('./src/modules/pedidos/pedidos_routes');
const fuenteDatosRoutes = require('./src/modules/fuente-datos/fuente_datos_routes');


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
app.use('/api/fuente-datos', fuenteDatosRoutes);

const iniciarJobSunat = require('./src/jobs/sunat_job');
iniciarJobSunat();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});