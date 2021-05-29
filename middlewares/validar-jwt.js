const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
   // Obtener el jwt desde el lugar que quiero
   const xtoken = req.header('x-token');
   let token;

   // Pasar bearer a mayusculas si biene en minusculas
   if (xtoken && xtoken.toLowerCase().startsWith('bearer')) {
      // Quitamos la palabra Bearer del token
      token = xtoken.split(' ')[1];
   }

   if (!token || !xtoken) {
      return res.status(400).json({
         msg: 'Sin autorización',
      });
   }

   try {
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

      // Leer el usuario que corresponde al uid
      const usuario = await Usuario.findById(uid);

      // verificar que el usuario exista
      if (!usuario) {
         return res.status(400).json({
            msg: 'Usuario no existe en la Base de Datos',
         });
      }

      // Verificar que el usuario exista en la BD
      if (!usuario.estado) {
         return res.status(400).json({
            msg: 'Sin autorización',
         });
      }

      req.usuario = usuario;

      next();
   } catch (error) {
      console.log(error);
      res.status(401).json({
         msg: 'No tiene autorización',
      });
   }
};

module.exports = {
   validarJWT,
};
