const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = (uid = '') => {
   return new Promise((resolve, reject) => {
      const payload = { uid };

      // Generar el token
      jwt.sign(
         payload,
         process.env.SECRETORPRIVATEKEY,
         {
            expiresIn: '1hr',
         },
         (err, token) => {
            if (err) {
               console.log(err);
               reject('No se pudo generar el jsonwebtoken');
            } else {
               resolve(token);
            }
         }
      );
   });
};

const comprobarJWT = async (token = '') => {
   try {
      //    Verificar que el token venga
      if (token.length < 10) {
         return null;
      }

      //   Verificamos el token y extraemos el uid
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

      //   Consultamos el usuario por el uid
      const usuario = await Usuario.findById(uid);

      //   Verificamos que el usuario exista
      if (usuario) {
         if (usuario.estado) {
            return usuario;
         } else {
            return null;
         }
      } else {
         return null;
      }
   } catch (error) {
      return null;
   }
};

module.exports = {
   generarJWT,
   comprobarJWT,
};
