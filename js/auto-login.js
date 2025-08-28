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

