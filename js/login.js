document.addEventListener('DOMContentLoaded', () => {

  let navBar = document.getElementById("navBarDiv");

  let modoOscuro = (localStorage.getItem("modo") === "Negro");

  //Funcion que cambia el modo
  function getModoTexto(){
    return modoOscuro ? "Negro" : "Blanco"; 
  }

  const btnLogin = document.getElementById('btnLogin');
  const usuarioInput = document.getElementById('usuario');
  const passwordInput = document.getElementById('password');
  const errorUsuario = document.getElementById('errorUsuario');
  const errorPassword = document.getElementById('errorPassword');

  const sessionKey = 'myAppSession';
  try {
    const existing = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    if (existing && existing.logged) {
      window.location.href = 'index.html';
      return;
    }
  } catch (e) {
    localStorage.removeItem(sessionKey);
  }

  function clearErrors() {
    errorUsuario.textContent = '';
    errorPassword.textContent = '';
  }

  function validate() {
    clearErrors();
    const user = usuarioInput.value.trim();
    const pass = passwordInput.value.trim();
    let ok = true;

    if (!user) {
      errorUsuario.textContent = 'El usuario no puede estar vacío.';
      ok = false;
    }
    if (!pass) {
      errorPassword.textContent = 'La contraseña no puede estar vacía.';
      ok = false;
    }
    return { ok, user, pass };
  }

  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const { ok, user } = validate();
    if (!ok) return;

    const sessionObj = {
      logged: true,
      user: user,
      createdAt: Date.now()
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionObj));

    const redirect = localStorage.getItem('redirectAfterLogin');
    if (redirect) {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect;
    } else {
      window.location.href = 'index.html';
    }
  });

  [usuarioInput, passwordInput].forEach(input => {
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        btnLogin.click();
      }
    });
  });


    if (navBar) {

    navBar.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark p-1 background-navbar">
    <div class="container">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav w-100 justify-content-between">
          <li class="nav-item">
            <div id="logoNavBar">
              <img src="img/login2.png" alt="Logo eMercado" class="img-fluid">
            </div>
          </li>
          <li class="nav-item">
            <div id="modoOscuro">
              <img src="img/sol.svg" alt="sol" id="sol" class="botonModoOscuro">
              <img src="img/luna.svg" alt="luna" id="luna" class="botonModoOscuro">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav> `;
  }

  //Boton para cambiar el modo
  const botonModoOscuro = document.getElementById("modoOscuro");
  const divImagen = document.getElementById("imagenEMercado");

  /*Modo Oscuro*/
  function actualizarModo(){
    //Cambiar color letra y fondo
    if (modoOscuro) {
      document.body.classList.add("oscuro");
      botonModoOscuro.classList.remove("activo"); //Desactivar el boton para que se mueva a la izquierda
      divImagen.innerHTML = `<img src="img/loginNegro.png" alt="Logo eMercado" class="img-fluid logo-login mb-4">`; //Inserto la imagen EMercado con las letras blancas
    } else {
      document.body.classList.remove("oscuro");
      botonModoOscuro.classList.add("activo"); //Activar el boton para que se mueva a la derecha
      divImagen.innerHTML = `<img src="img/login.png" alt="Logo eMercado" class="img-fluid logo-login mb-4">`; //Inserto la imagen EMercado con las letras negras
    }
  } 

  botonModoOscuro.addEventListener("click", function(){
    modoOscuro = !modoOscuro;
    localStorage.setItem("modo", getModoTexto());
    actualizarModo();
  });

  //Actualizar el modo al iniciar la pagina
  actualizarModo();


});

