const BASE_AUTH_API_URL = "http://localhost:3000/auth";

document.addEventListener('DOMContentLoaded', () => {

  let modoOscuro = (localStorage.getItem("modo") === "Negro");

  //Funcion que cambia el modo
  function getModoTexto() {
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

  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    const { ok, user, pass } = validate();
    if (!ok) return;

    try {
      // 1. Hacer POST a /login
      const res = await fetch(`${BASE_AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user,
          password: pass
        })
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      // 2. Guardar token JWT
      localStorage.setItem("authToken", data.token);

      // 3. Guardar info de sesión
      const sessionObj = {
        logged: true,
        user: user,
        createdAt: Date.now()
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionObj));

      // 4. Redirección
      const redirect = localStorage.getItem('redirectAfterLogin');
      if (redirect) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirect;
      } else {
        window.location.href = 'index.html';
      }

    } catch (error) {
      console.error(error);
      alert("Hubo un error al iniciar sesión. Intenta de nuevo.");
    }
  });


  [usuarioInput, passwordInput].forEach(input => {
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        btnLogin.click();
      }
    });
  });


  //Boton para cambiar el modo
  const botonModoOscuro = document.getElementById("modoOscuro");
  const divImagen = document.getElementById("imagenEMercado");

  /*Modo Oscuro*/
  function actualizarModo() {
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

  botonModoOscuro.addEventListener("click", function () {
    modoOscuro = !modoOscuro;
    localStorage.setItem("modo", getModoTexto());
    actualizarModo();
  });

  //Actualizar el modo al iniciar la pagina
  actualizarModo();


});

