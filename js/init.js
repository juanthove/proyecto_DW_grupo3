const CATEGORIES_URL = "http://localhost:3000/products/cats/getAll";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/products/cats_products/";
let navBar = document.getElementById("navBarDiv");
const userObj = localStorage.getItem('myAppSession');
const token = localStorage.getItem('authToken')
const parsedUser = JSON.parse(userObj);


let modoOscuro = (localStorage.getItem("modo") === "Negro");
//Funcion que cambia el modo
function getModoTexto() {
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
  return fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {

      if (response) {
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

function updateCartBadge() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || { productos: [] };
  let total = 0;

  if (cartItems && cartItems.productos.length > 0) {
    total = cartItems.productos.reduce((acc, p) => acc + (parseInt(p.cantidad) || 1), 0);
  }

  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = total > 0 ? total : "";
    badge.style.display = total > 0 ? "inline" : "none";
  }
}

if (navBar) {

  navBar.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-dark p-1 background-navbar">
  <div class="container d-flex">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">

      <ul class="navbar-nav w-100 align-items-center">

        <!-- Grupo 1: Logo -->
        <li class="nav-item ms-5 me-4" id="logoNav">
          <a class="nav-link white-space-nowrap" href="index.html">
            <img src="img/logoNegroNavbar.png" alt="Logo" class="logo-img" id="logoImg">
          </a>
        </li>

        <!-- Grupo 2: Categorías -->
        <div class="d-flex align-items-center gap-4 flex-grow-1 justify-content-center">

          <li class="nav-item fs-5">
            <a class="nav-link white-space-nowrap" href="categories.html">Categorías</a>
          </li>

          <li class="nav-item fs-5">
            <a class="nav-link white-space-nowrap" href="sell.html">Vender</a>
          </li>

          <li class="nav-item fs-5 position-relative">
            <a class="nav-link white-space-nowrap position-relative" href="cart.html">
              Mi carrito
              <span id="cart-badge" class="badge bg-danger position-absolute cart-badge"></span>
            </a>
          </li>

        </div>

        <!-- Grupo 3: Usuario + modo oscuro + moneda -->
        <div class="d-flex align-items-center gap-4 me-5">

          <li class="nav-item fs-5">
            <div class="dropdown">
              <a class="nav-link dropdown-toggle white-space-nowrap" href="#" role="button" data-bs-toggle="dropdown">
                ${parsedUser.user}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item border-bottom" id="user" href="my-profile.html">Mi perfil</a></li>
                <li><button id="logoutBtn" class="btn btn-outline-secondary m-2">Cerrar sesión</button></li>
              </ul>
            </div>
          </li>

          <li class="nav-item">
            <div id="modoOscuro" class="d-flex align-items-center">
              <img src="img/sol.svg" alt="sol" id="sol" class="botonModoOscuro me-1">
              <img src="img/luna.svg" alt="luna" id="luna" class="botonModoOscuro">
            </div>
          </li>

          <li class="nav-item text-center" id="currencySelectorContainer">
            <p class="text-white fs-6 mb-0 white-space-nowrap">Moneda:</p>
            <div id="currencySelector" class="d-flex justify-content-center align-items-center gap-2 mt-2">
              <img src="img/Flag_of_Uruguay.svg.webp" alt="UY flag" id="uyu" class="currencyIcon">
              <img src="img/Flag_of_The_United_States.svg.webp" alt="USA flag" id="usd" class="currencyIcon">
            </div>
          </li>

        </div>

      </ul>
    </div>
  </div>
</nav>`;
}

//Boton para cambiar el modo
const botonModoOscuro = document.getElementById("modoOscuro");

/*Modo Oscuro*/
function actualizarModo() {
  //Cambiar color letra y fondo
  if (modoOscuro) {
    document.body.classList.add("oscuro");
    botonModoOscuro.classList.remove("activo"); //Desactivar el boton para que se mueva a la izquierda

  } else {
    document.body.classList.remove("oscuro");
    botonModoOscuro.classList.add("activo"); //Activar el boton para que se mueva a la derecha

  }
}

//logica de conversion de divisas USD a UYU y viceversa

async function getExchangeRates() {
  const url = "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=b0c26dcf820542348a28b7b23d288065&symbols=UYU,USD&base=USD";
  const response = await getJSONData(url);
  if (response?.data?.rates) {
    return { date: response.data.date, rates: response.data.rates };
  } else {
    console.error("Error al obtener las tasas de cambio:", response.data);
    return null;
  }
}

// Inicializar las tasas de cambio 

async function initExchangeRates() {
  const today = new Date();
  const savedRates = JSON.parse(localStorage.getItem("exchangeRates"));
  let rates;
  if (!savedRates || savedRates?.date < today) {
    rates = await getExchangeRates();
  } else {
    rates = savedRates;
  }

  localStorage.setItem("exchangeRates", JSON.stringify(rates));
}

function convertPrice(amount, fromCurrency, toCurrency) {

  const { rates } = JSON.parse(localStorage.getItem("exchangeRates"));
  if (!rates) {
    return amount; // Si no hay tasas de cambio, devuelve el monto original
  }

  if (fromCurrency === toCurrency) {
    return amount; // No se necesita conversión
  }

  if (fromCurrency === "USD" && toCurrency === "UYU") {
    return amount * rates.UYU;
  }

  if (fromCurrency === "UYU" && toCurrency === "USD") {
    return amount / rates.UYU;
  }
  return amount; // Si las monedas no son reconocidas, devuelve el monto original
}

function currencyIconsHandler() {
  const uyFlag = document.getElementById("uyu");
  const usFlag = document.getElementById("usd");
  let selectedCurrency = localStorage.getItem("currency") || "USD";

  // estado visual inicial

  if (selectedCurrency === "USD") {
    usFlag.classList.add("active");
    uyFlag.classList.remove("active");
  } else {
    uyFlag.classList.add("active");
    usFlag.classList.remove("active");
  }
  // Manejo de clicks en los iconos de moneda

  uyFlag?.addEventListener("click", () => {
    localStorage.setItem("currency", "UYU");
    location.reload();
  });

  usFlag?.addEventListener("click", () => {
    localStorage.setItem("currency", "USD");
    location.reload();
  });
}



//Fin logica de conversion de divisas

document.addEventListener('DOMContentLoaded', () => {
  currencyIconsHandler(); // Inicializa el selector de moneda
  initExchangeRates(); // Inicializa las tasas de cambio  
  updateCartBadge();

  window.addEventListener('storage', function (e) {
    if (e.key === 'cartItems') {
      updateCartBadge();
    }
  });
  const btn = document.getElementById('logoutBtn');
  if (!btn) return; // si la página no tiene botón, no hace nada

  btn.addEventListener('click', () => {
    localStorage.removeItem('myAppSession');
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = 'login.html';
  });

  botonModoOscuro.addEventListener("click", function () {
    modoOscuro = !modoOscuro;
    localStorage.setItem("modo", getModoTexto());
    actualizarModo();
  });

  //Actualizar el modo al iniciar la pagina
  actualizarModo();

});





