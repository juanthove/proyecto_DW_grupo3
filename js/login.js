document.addEventListener('DOMContentLoaded', () => {
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
});