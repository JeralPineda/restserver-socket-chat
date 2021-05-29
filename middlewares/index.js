const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');
const validarArchivoSubir = require('../middlewares/validar-archivo');

module.exports = {
   ...validarJWT,
   ...validarRoles,
   ...validarCampos,
   ...validarArchivoSubir,
};
