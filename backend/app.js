require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 20, 
  message: { error: 'Muchos intentos de acceso. Intenta en una hora.' }
});


const corsOptions = {
  origin: [process.env.CLIENT_URL || 'https://superpollohyo.com'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const autenticacionRoutes = require('./src/modules/autenticacion/autenticacion_routes');
const usuarioRoutes = require('./src/modules/usuarios/usuario_routes');

app.get('/', (req, res) => {
  res.send("Super-pollo API Running");
});

app.use('/api/auth', authLimiter, autenticacionRoutes);
app.use('/api', generalLimiter);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/caja', require('./src/modules/caja/caja_routes'));
app.use('/api/insumos', require('./src/modules/inventario/insumos/insumo_routes'));
app.use('/api/productos', require('./src/modules/inventario/productos/producto_routes'));
app.use('/api/reservaciones', require('./src/modules/reservacion/reservacion_routes'));
app.use('/api/ventas', require('./src/modules/ventas/ventas_routes'));
app.use('/api/pedidos', require('./src/modules/pedidos/pedidos_routes'));
app.use('/api/fuente-datos', require('./src/modules/fuente-datos/fuente_datos_routes'));
app.use('/api', require('./src/modules/configuracion/configuracion_routes'));

const iniciarJobSunat = require('./src/jobs/sunat_job');
iniciarJobSunat();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});