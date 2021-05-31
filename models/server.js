const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      // socket.io
      this.server = createServer(this.app);
      this.io = require('socket.io')(this.server);

      this.paths = {
         auth: '/api/auth',
         buscar: '/api/buscar',
         categorias: '/api/categorias',
         productos: '/api/productos',
         uploads: '/api/uploads',
         usuarios: '/api/usuarios',
      };

      //   Conectar base de datos
      this.connectarDB();

      //   Middlewares
      this.middlewares();

      //   rutas de mi app
      this.routes();

      //   Sockets
      this.sockets();
   }

   async connectarDB() {
      await dbConnection();
   }

   middlewares() {
      //    CORS
      this.app.use(cors());

      //   Lectura y parseo del Body
      this.app.use(express.json());

      //    Directorio publico
      this.app.use(express.static('public'));

      //   Fileupload - Carga de archivos
      this.app.use(
         fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true, //crea el directorio si no existe
         })
      );
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.usuarios, require('../routes/usuarios'));
      this.app.use(this.paths.categorias, require('../routes/categorias'));
      this.app.use(this.paths.productos, require('../routes/productos'));
      this.app.use(this.paths.uploads, require('../routes/uploads'));
      this.app.use(this.paths.buscar, require('../routes/buscar'));
   }

   sockets() {
      this.io.on('connection', (socket) => socketController(socket, this.io));
   }

   listen() {
      this.server.listen(this.port, () => {
         console.log(`Puerto corriendo en http://localhost:${this.port}`);
      });
   }
}

module.exports = Server;
