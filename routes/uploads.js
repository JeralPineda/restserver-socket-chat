const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarJWT, tieneRole, validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [validarArchivoSubir, validarJWT, tieneRole('ADMIN_ROLE', 'VENTAS_ROLE')], cargarArchivo);

router.put('/:coleccion/:id', [validarArchivoSubir, validarJWT, tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), check('id', 'el id debe de ser de Mongo').isMongoId(), check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])), validarCampos], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [check('id', 'el id debe de ser de Mongo').isMongoId(), check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])), validarCampos], mostrarImagen);

module.exports = router;
