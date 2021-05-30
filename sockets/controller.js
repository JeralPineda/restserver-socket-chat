const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');

const socketController = async (socket = new Socket()) => {
   const token = socket.handshake.headers['x-token'];

   // verificamos el token
   const usuario = await comprobarJWT(token);

   if (!usuario) {
      //    si no existe el usuario desconecto el socket del servidor
      return socket.disconnect();
   }

   console.log('Se conecto ', usuario.nombre);
};

module.exports = {
   socketController,
};
