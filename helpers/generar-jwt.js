const jwt = require('jsonwebtoken');

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

module.exports = {
   generarJWT,
};
