const express = require('express');
const app = express();

// Define la ruta de callback de firma
app.post('/callback-firma', (req, res) => {
  // Procesar la información del firmante
  // ...
  
  // Enviar una respuesta HTTP 200 para indicar que has recibido y procesado el callback
  res.sendStatus(200);
});

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
