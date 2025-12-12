const express = require('express');
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;


app.get('/', (req, res) => {
  res.send("Super-pollo") 
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});