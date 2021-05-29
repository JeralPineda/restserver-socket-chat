require('dotenv').config();

const Server = require('./models/server');

const server = new Server();

// Levantar el servidor
server.listen();
