const btnLogin = document.getElementById('btnLogin');
const usuario = document.getElementById('usuario');
const password = document.getElementById('password');
const errorUsuario = document.getElementById('errorUsuario');
const errorPassword = document.getElementById('errorPassword');

btnLogin.addEventListener('click', function() {
  let valido = true;

  errorUsuario.textContent = '';
  errorPassword.textContent = '';

  if (usuario.value.trim() === '') {
    errorUsuario.textContent = 'El campo "Usuario" es obligatorio.';
    valido = false;
  }

  if (password.value.trim() === '') {
    errorPassword.textContent = 'El campo "Contraseña" es obligatorio.';
    valido = false;
  }

  if (valido) {
    window.location.href = 'index.html';
  }
});