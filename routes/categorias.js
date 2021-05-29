const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, obtenerCategorías, obtenerCaregoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCaegoriaPorId } = require('../helpers/db-validators');

const router = Router();

/*
    {{url}}/api/categorias
*/

router.get('/', obtenerCategorías);

router.get('/:id', [check('id', 'No es un id de Mongo valido').isMongoId(), check('id').custom(existeCaegoriaPorId), validarCampos], obtenerCaregoria);

router.post('/', [validarJWT, check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], crearCategoria);

// Actualizar un registro por id - privado cualquiera con un token valido
router.put('/:id', [validarJWT, check('nombre', 'El nombre es obligatorio').not().isEmpty(), check('id', 'No es un id de Mongo valido').isMongoId(), check('id').custom(existeCaegoriaPorId), validarCampos], actualizarCategoria);

// Borrar una categoría - Admin - estado: false
router.delete('/:id', [validarJWT, esAdminRole, check('id', 'No es un id de Mongo valido').isMongoId(), check('id').custom(existeCaegoriaPorId), validarCampos], borrarCategoria);

module.exports = router;
