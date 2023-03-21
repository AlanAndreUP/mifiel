export default async function handler(req, res) {
    // Aquí deberías manejar la información que recibes del servidor remoto
  
    // Ejemplo de cómo obtener información de la petición
    const { query, body, headers } = req;
  
    // Aquí deberías realizar la lógica necesaria para manejar la información recibida
    // y enviar una respuesta adecuada al cliente
  
    // Ejemplo de cómo enviar una respuesta de éxito con un mensaje
    res.status(200).json({ message: 'Información recibida correctamente' });
  }
  