const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCaegoriaPorId } = require('../helpers/db-validators');

const router = Router();

/*
    {{url}}/api/productos
*/

router.get('/', obtenerProductos);

router.get('/:id', [check('id', 'No es un id de Mongo valido').isMongoId(), check('id').custom(existeProductoPorId), validarCampos], obtenerProducto);

router.post('/', [validarJWT, check('nombre', 'El nombre es obligatorio').not().isEmpty(), check('categoria', 'No es un id de Mongo').isMongoId(), check('categoria').custom(existeCaegoriaPorId), validarCampos], crearProducto);

// Actualizar - privado - cualquiera con token válido
router.put(
   '/:id',
   [
      validarJWT,
      // check('categoria','No es un id de Mongo').isMongoId(),
      check('id').custom(existeProductoPorId),
      validarCampos,
   ],
   actualizarProducto
);

// Borrar una categoría - Admin - estado: false
router.delete('/:id', [validarJWT, esAdminRole, check('id', 'No es un id de Mongo valido').isMongoId(), check('id').custom(existeProductoPorId), validarCampos], borrarProducto);

module.exports = router;
