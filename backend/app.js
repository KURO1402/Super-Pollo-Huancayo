require('dotenv').config(); // 1. Variables de entorno primero

const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


const autenticacionRoutes = require('./src/modules/autenticacion/autenticacion_routes');
const usuarioRoutes = require('./src/modules/usuarios/usuario_routes');
const cajaRoutes = require('./src/modules/caja/caja_routes');

app.get('/', (req, res) => {
  res.send("Super-pollo");
});

app.use('/api/auth', autenticacionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/caja', cajaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
