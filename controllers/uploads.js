const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {
   try {
      //    txt, md
      //   const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

      const nombre = await subirArchivo(req.files, undefined, 'imgs');

      res.json({
         nombre,
      });
   } catch (msg) {
      res.status(400).json({ msg });
   }
};

const actualizarImagen = async (req, res = response) => {
   const { id, coleccion } = req.params;

   let modelo;

   switch (coleccion) {
      case 'usuarios':
         //   Verificamos que el id exista en la BD
         modelo = await Usuario.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un usuario con el id: ${id}`,
            });
         }

         break;

      case 'productos':
         //   Verificamos que el id exista en la BD
         modelo = await Producto.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un producto con el id: ${id}`,
            });
         }

         break;

      default:
         return res.status(500).json({
            msg: 'Se me olvido validar esto',
         });
   }

   // Limpiar imágenes previas antes de guardar la nueva
   if (modelo.img) {
      // Hay que borrar la imagen del servidor
      const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

      // Validamos si existe el archivo
      if (fs.existsSync(pathImg)) {
         // si existe la borro
         fs.unlinkSync(pathImg);
      }
   }

   // Directorio donde se guardara la imagen
   const nombre = await subirArchivo(req.files, undefined, coleccion);
   modelo.img = nombre;

   // Guardamos en la BD
   await modelo.save();

   res.json(modelo);
};

// Servicio a utilizar
const actualizarImagenCloudinary = async (req, res = response) => {
   const { id, coleccion } = req.params;

   let modelo;

   switch (coleccion) {
      case 'usuarios':
         //   Verificamos que el id exista en la BD
         modelo = await Usuario.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un usuario con el id: ${id}`,
            });
         }

         break;

      case 'productos':
         //   Verificamos que el id exista en la BD
         modelo = await Producto.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un producto con el id: ${id}`,
            });
         }

         break;

      default:
         return res.status(500).json({
            msg: 'Se me olvido validar esto',
         });
   }

   // Limpiar imágenes previas antes de guardar la nueva
   if (modelo.img) {
      // extraemos y cortamos la extension del id de la url de la imagen
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1]; //obtener la ultima posición

      const [public_id] = nombre.split('.');

      // Borramos de cloudinary
      cloudinary.uploader.destroy(public_id);
   }

   //    Extraemos el path del archivo, loudinary
   const { tempFilePath } = req.files.archivo;

   //    Subir a cloudinary
   const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
   modelo.img = secure_url;

   // Guardamos en la BD
   await modelo.save();

   res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
   const { id, coleccion } = req.params;

   let modelo;

   switch (coleccion) {
      case 'usuarios':
         //   Verificamos que el id exista en la BD
         modelo = await Usuario.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un usuario con el id: ${id}`,
            });
         }

         break;

      case 'productos':
         //   Verificamos que el id exista en la BD
         modelo = await Producto.findById(id);

         if (!modelo) {
            return res.status(400).json({
               msg: `No existe un producto con el id: ${id}`,
            });
         }

         break;

      default:
         return res.status(500).json({
            msg: 'Se me olvido validar esto',
         });
   }

   // Mandamos la imagen si existe en el servidor
   if (modelo.img) {
      // Hay que borrar la imagen del servidor
      const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

      // Validamos si existe el archivo
      if (fs.existsSync(pathImg)) {
         //   Mandamos el archivo
         return res.sendFile(pathImg);
      }
   }

   //  Si no existe una imagen en el servidor, mandamos una imagen por defecto
   const pathImgDefault = path.join(__dirname, '../assets/no-image.jpg');
   res.sendFile(pathImgDefault);
};

module.exports = {
   cargarArchivo,
   actualizarImagen,
   actualizarImagenCloudinary,
   mostrarImagen,
};
