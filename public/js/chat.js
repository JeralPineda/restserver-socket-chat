// Si la url es localhost usar una de las 2 url
const url = window.location.hostname.includes('localhost') ? 'http://localhost:4000/api/auth/' : 'https://restserver-node-jc.herokuapp.com/api/auth/';

// Validar si el JWT es correcto
let usuario = null;
let socket = null;

// Validar JWT del localStorage
const validarJWT = async () => {
   const token = localStorage.getItem('token') || '';

   if (token <= 10) {
      window.location = 'index.html';
      throw new Error('No hay token en el servidor');
   }

   const resp = await fetch(url, {
      headers: { 'x-token': `Bearer ${token}` },
   });

   const { usuario: userDB, token: tokenDB } = await resp.json();

   //    Guardamos el nuevo token
   localStorage.setItem('token', tokenDB);

   //    Guardamos el usuario obtenido del servidor
   usuario = userDB;

   //    Generamos el titulo de la pagina chat
   document.title = usuario.nombre;
};

const main = async () => {
   // validarJWT
   await validarJWT();
};

main();
// const socket = io();
