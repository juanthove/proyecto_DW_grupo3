document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
    const profilePic = document.getElementById("profilePic");
    const imagenInput = document.getElementById("imagen");

    //Chequeamos si hay sesión activa.
    let sessionUser = null;
    try {
        const session = JSON.parse(localStorage.getItem("myAppSession"));
        if (session && session.logged) {
            sessionUser = session.user;
        }
    } catch (e) {
        console.warn("⚠️ Sesión inexistente.")
    }

    //Cargamos los datos guardados si existen.
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
    } catch (e) {
        console.warn("⚠️ perfilUsuario no es JSON válido. Se limpia.");
        localStorage.removeItem("perfilUsuario");
        userData = {};
    }

    //Si no hay perfil guardado, precargamos el usuario del login en el campo email.
    if (!userData.email && sessionUser) {
        userData.email = sessionUser;
    }

    //Llenamos campos del form.
    document.getElementById("nombre").value = userData.nombre || "";
    document.getElementById("apellido").value = userData.apellido || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("telefono").value = userData.telefono || "";

    const savedProfilePic = localStorage.getItem("profilePic");
    if (savedProfilePic) {
        profilePic.src = savedProfilePic;
    }

    //Cambiar imagen del perfil, se guarda.
    imagenInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePic.src = reader.result;
                localStorage.setItem("profilePic", reader.result);
            };
            reader.readAsDataURL(file);
        }        
    });

    //Guardar cambios.
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const perfilUsuario = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            email: document.getElementById("email").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
        };
        //Guardar en localStorage.
        localStorage.setItem("perfilUsuario", JSON.stringify(perfilUsuario));
        //Alerta.
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-success mt-3";
        alertDiv.textContent = "✅ Perfil guardado correctamente";
        form.appendChild(alertDiv);
        //Quitar alerta después de 2 segundos
        setTimeout(() => alertDiv.remove(), 2000);
    });
});