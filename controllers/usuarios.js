const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
   const { limite = 5, desde = 0 } = req.query;

   const query = { estado: true };

   //    const usuarios = await Usuario.find(query).skip(Number(desde)).limit(Number(limite));

   //    const total = await Usuario.countDocuments(query);

   const [total, usuarios] = await Promise.all([Usuario.countDocuments(query), Usuario.find(query).skip(Number(desde)).limit(Number(limite))]);

   res.json({
      total,
      usuarios,
   });
};

const usuariosPost = async (req, res = response) => {
   const { nombre, correo, password, rol } = req.body;
   const usuario = new Usuario({ nombre, correo, password, rol });

   // Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   usuario.password = bcryptjs.hashSync(password, salt);

   // Guardar en BD
   await usuario.save();

   res.status(201).json({
      usuario,
   });
};

const usuariosPut = async (req = request, res = response) => {
   const { id } = req.params;
   const { _id, password, google, correo, ...resto } = req.body;

   // Verificar que si viene el password que lo encripte
   if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
   }

   const usuario = await Usuario.findByIdAndUpdate(id, resto);

   res.json({
      usuario,
   });
};

const usuariosPatch = (req, res = response) => {
   res.json({
      msg: 'patch API - usuariosPatch',
   });
};

const usuariosDelete = async (req = request, res = response) => {
   const { id } = req.params;
   const query = { estado: false };

   //    Borrado físicamente (no recomendado)
   //    const usuario = await Usuario.findByIdAndDelete(id);

   // Borrado cambiando el estado del usuario
   const usuario = await Usuario.findByIdAndUpdate(id, query);
   const usuarioAutenticado = req.usuario;

   res.json({ usuario, usuarioAutenticado });
};

module.exports = {
   usuariosGet,
   usuariosPost,
   usuariosPut,
   usuariosPatch,
   usuariosDelete,
};
