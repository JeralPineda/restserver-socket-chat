const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');

const router = Router();

router.post('/login', [check('correo', 'El correo no es valido').isEmail(), check('password', 'La contraseña es obligatoria').not().isEmpty(), validarCampos], login);

router.post('/google', [check('id_token', 'El id_token es necesario').not().isEmpty(), validarCampos], googleSignIn);

router.get('/', [validarJWT], renovarToken);

module.exports = router;
