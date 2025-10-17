const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
let navBar = document.getElementById("navBarDiv");
const userObj = localStorage.getItem('myAppSession');
const parsedUser = JSON.parse(userObj);


let modoOscuro = (localStorage.getItem("modo") === "Negro");
//Funcion que cambia el modo
function getModoTexto(){
  return modoOscuro ? "Negro" : "Blanco"; 
}


let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

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
          <a class="nav-link" href="index.html">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="categories.html">Categorías</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="sell.html">Vender</a>
        </li>
        <li>
          <a class="nav-link" href="my-profile.html">Mi perfil</a>
        </li>
        <li class="nav-item">

          <div class="dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              ${parsedUser.user}
            </a>

            <ul class="dropdown-menu">
              <li>
                <button id="logoutBtn" class="btn btn-outline-secondary m-2 mt-auto mb-auto">Cerrar sesión</button>
              </li>

            </ul>
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
const fondo = document.getElementById("fondo");

/*Modo Oscuro*/
function actualizarModo(){
  //Cambiar color letra y fondo
  if (modoOscuro) {
    document.body.classList.add("oscuro");
    botonModoOscuro.classList.remove("activo"); //Desactivar el boton para que se mueva a la izquierda

  } else {
    document.body.classList.remove("oscuro");
    botonModoOscuro.classList.add("activo"); //Activar el boton para que se mueva a la derecha
    
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return; // si la página no tiene botón, no hace nada

  btn.addEventListener('click', () => {
    localStorage.removeItem('myAppSession');
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = 'login.html';
  });

  botonModoOscuro.addEventListener("click", function(){
    modoOscuro = !modoOscuro;
    localStorage.setItem("modo", getModoTexto());
    actualizarModo();
  });

  //Actualizar el modo al iniciar la pagina
  actualizarModo();
});





