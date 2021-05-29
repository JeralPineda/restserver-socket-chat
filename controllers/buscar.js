const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
   const esMongoID = ObjectId.isValid(termino); //Si es ID regresa true

   if (esMongoID) {
      //    Búsqueda por id
      const usuario = await Usuario.findById(termino);

      return res.json({
         results: usuario ? [usuario] : [],
      });
   }

   // Búsquedas sensibles
   const regex = new RegExp(termino, 'i');

   // Buscar por nombre - También se puede usar count en vez de find para contar los resultados
   const usuarios = await Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
   });
};

const buscarCategorias = async (termino = '', res = response) => {
   const esMongoID = ObjectId.isValid(termino); //Si es ID regresa true

   if (esMongoID) {
      //    Búsqueda por id
      const categoria = await Categoria.findById(termino);

      return res.json({
         results: categoria ? [categoria] : [],
      });
   }

   // Búsquedas sensibles
   const regex = new RegExp(termino, 'i');

   // Buscar por nombre - También se puede usar count en vez de find para contar los resultados
   const categorias = await Categoria.find({ nombre: regex, estado: true });

   res.json({
      results: categorias,
   });
};

const buscarProductos = async (termino = '', res = response) => {
   const esMongoID = ObjectId.isValid(termino); //Si es ID regresa true

   if (esMongoID) {
      //    Búsqueda por id
      const producto = await Producto.findById(termino).populate('categoria', 'nombre');

      return res.json({
         results: producto ? [producto] : [],
      });
   }

   // Búsquedas sensibles
   const regex = new RegExp(termino, 'i');

   // Buscar por nombre - También se puede usar count en vez de find para contar los resultados
   const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

   res.json({
      results: productos,
   });
};

const buscar = (req, res = response) => {
   const { coleccion, termino } = req.params;

   if (!coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
         msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
      });
   }

   switch (coleccion) {
      case 'usuarios':
         buscarUsuarios(termino, res);
         break;

      case 'categorias':
         buscarCategorias(termino, res);
         break;

      case 'productos':
         buscarProductos(termino, res);
         break;

      default:
         res.status(500).json({
            msg: 'Se le olvido hacer la búsqueda',
         });
   }
};

module.exports = {
   buscar,
};
