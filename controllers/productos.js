const { response, request } = require('express');
const { Producto } = require('../models');

// Obtener todas las categorías con paginado
const obtenerProductos = async (req, res = response) => {
   const { limite = 5, desde = 0 } = req.query;
   const query = { estado: true };

   const [total, productos] = await Promise.all([Producto.countDocuments(query), Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre').skip(Number(desde)).limit(Number(limite))]);

   res.json({
      total,
      productos,
   });
};

// obtenerCategoría por id
const obtenerProducto = async (req, res = response) => {
   const { id } = req.params;

   // populate permite una relación, asi mostramos la info del usuario que creo la categoría
   const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

   res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
   const { estado, usuario, ...body } = req.body;

   // Verificar que exista una categoría en la BD
   const productoDB = await Producto.findOne({ nombre: body.nombre });

   if (productoDB) {
      return res.status(400).json({
         msg: `El producto ${productoDB.nombre} ya existe `,
      });
   }

   // Generar la data a guardar
   const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
   };

   const producto = new Producto(data);

   // Grabar la data en la BD
   await producto.save();

   res.status(201).json(producto);
};

// actualizarproducto
const actualizarProducto = async (req, res = response) => {
   const { id } = req.params;
   const { estado, usuario, ...data } = req.body;

   if (data.nombre) {
      //    Pasamos a mayúsculas el nombre de la producto
      data.nombre = data.nombre.toUpperCase();
   }

   // Establecer el usuario que realizo la modificación
   data.usuario = req.usuario._id;

   const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

   res.status(200).json({
      producto,
   });
};

// Borrar producto - estado:false
const borrarProducto = async (req, res = response) => {
   const { id } = req.params;
   const productoBorrado = await Producto.findOneAndUpdate(id, { estado: false }, { new: true });

   res.json({
      productoBorrado,
   });
};

module.exports = {
   crearProducto,
   obtenerProductos,
   obtenerProducto,
   actualizarProducto,
   borrarProducto,
};
