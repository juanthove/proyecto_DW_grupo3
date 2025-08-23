(function(){
    const sessionKey = 'myAppSession';
    try {
      const s = JSON.parse(localStorage.getItem(sessionKey) || 'null');
      if (!s || !s.logged) {
        // Guardar la URL para volver después del login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
      }
    } catch (err) {
      localStorage.removeItem(sessionKey);
      localStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = 'login.html';
    }
  })();

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return; // si la página no tiene botón, no hace nada

    btn.addEventListener('click', () => {
      localStorage.removeItem('myAppSession');
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = 'login.html';
    });
  });