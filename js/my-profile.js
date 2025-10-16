document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
    const profilePic = document.getElementById("profilePic");
    const imagenInput = document.getElementById("imagen");

    //Cargamos los datos guardados.
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
    } catch (e) {
        console.warn("⚠️ perfilUsuario no es JSON válido. Se limpia.");
        localStorage.removeItem("perfilUsuario");
        userData = {};
    }

    //Llenamos campos del form.
    document.getElementById("nombre").value = userData.nombre || "";
    document.getElementById("apellido").value = userData.apellido || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("telefono").value = userData.telefono || "";

    //Cambiar imagen del perfil, no se guarda.
    imagenInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePic.src = reader.result;
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