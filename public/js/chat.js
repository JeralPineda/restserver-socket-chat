// Si la url es localhost usar una de las 2 url
const url = window.location.hostname.includes('localhost') ? 'http://localhost:4000/api/auth/' : 'https://restserver-node-jc.herokuapp.com/api/auth/';

// Validar si el JWT es correcto
let usuario = null;
let socket = null;

// Referencias HTML
const btnSalir = document.querySelector('#btnSalir');
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');

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

   //    validamos socket con JWT
   await conectarSocket();
};

const conectarSocket = async () => {
   socket = io({
      extraHeaders: {
         'x-token': localStorage.getItem('token'),
      },
   });

   socket.on('connect', () => {
      console.log('Sockets online');
   });

   socket.on('disconnect', () => {
      console.log('Sockets offline');
   });

   socket.on('recibir-mensajes', dibujarMensajes);

   socket.on('usuarios-activos', dibujarUsuarios);

   socket.on('mensaje-privado', (payload) => {
      console.log('Privado: ', payload);
   });
};

const dibujarUsuarios = (usuarios = []) => {
   let usersHTML = '';

   usuarios.forEach(({ nombre, uid }) => {
      usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
   });

   ulUsuarios.innerHTML = usersHTML;
};

const dibujarMensajes = (mensajes = []) => {
   let mensajesHTML = '';

   mensajes.forEach(({ nombre, mensaje }) => {
      mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span class="fs-6 text-muted">${mensaje}</span>
                </p>
            </li>
        `;
   });

   ulMensajes.innerHTML = mensajesHTML;
};

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
   const mensaje = txtMensaje.value;
   const uid = txtUid.value;

   if (keyCode !== 13) return;

   if (mensaje.length === 0) return;

   socket.emit('enviar-mensaje', { mensaje, uid });

   //    Limpiar mensajes
   txtMensaje.value = '';
});

btnSalir.addEventListener('click', () => {
   localStorage.removeItem('token');

   const auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(() => {
      console.log('User signed out.');
      window.location = 'index.html';
   });
});

const main = async () => {
   // validarJWT
   await validarJWT();
};

(() => {
   gapi.load('auth2', () => {
      gapi.auth2.init();
      main();
   });
})();

// main()
