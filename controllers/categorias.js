const { response, request } = require('express');
const { Categoria } = require('../models');

// Obtener todas las categorías con paginado
const obtenerCategorías = async (req, res = response) => {
   const { limite = 5, desde = 0 } = req.query;
   const query = { estado: true };

   const [total, categorias] = await Promise.all([Categoria.countDocuments(query), Categoria.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite))]);

   res.json({
      total,
      categorias,
   });
};

// obtenerCategoría por id
const obtenerCaregoria = async (req, res = response) => {
   const { id } = req.params;

   // populate permite una relación, asi mostramos la info del usuario que creo la categoría
   const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

   res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
   const nombre = req.body.nombre.toUpperCase();

   // Verificar que exista una categoría en la BD
   const categoriaDB = await Categoria.findOne({ nombre });

   if (categoriaDB) {
      return res.status(400).json({
         msg: `La categoria ${categoriaDB.nombre} ya existe `,
      });
   }

   // Generar la data a guardar
   const data = {
      nombre,
      usuario: req.usuario._id,
   };

   const categoria = new Categoria(data);

   // Grabar la data en la BD
   await categoria.save();

   res.status(201).json({
      categoria,
   });
};

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
   const { id } = req.params;
   const { estado, usuario, ...data } = req.body;

   //    Pasamos a mayúsculas el nombre de la categoria
   data.nombre = data.nombre.toUpperCase();

   // Establecer el usuario que realizo la modificación
   data.usuario = req.usuario._id;

   const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

   res.status(200).json({
      categoria,
   });
};

// Borrar categoria - estado:false
const borrarCategoria = async (req, res = response) => {
   const { id } = req.params;
   const categoriaBorrada = await Categoria.findOneAndUpdate(id, { estado: false }, { new: true });

   res.json({
      categoriaBorrada,
   });
};

module.exports = {
   crearCategoria,
   obtenerCategorías,
   obtenerCaregoria,
   actualizarCategoria,
   borrarCategoria,
};
