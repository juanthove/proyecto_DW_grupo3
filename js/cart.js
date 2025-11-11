document.addEventListener("DOMContentLoaded", function (e) {
    envioRate = parseFloat(localStorage.getItem("envioRate")) || 0;
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    generateProductsItems(cartItems.productos);
    updateResume(cartItems.productos);

    const envioOpciones = document.getElementsByName("optionsEnvio");
    if (envioRate === 0.15) document.getElementById("premiumOption").checked = true;
    else if (envioRate === 0.07) document.getElementById("expressOption").checked = true;
    else if (envioRate === 0.05) document.getElementById("standardOption").checked = true;
    envioOpciones.forEach(opt => {
    opt.addEventListener("change", () => {
      if (opt.id === "premiumOption") envioRate = 0.15;
      else if (opt.id === "expressOption") envioRate = 0.07;
      else if (opt.id === "standardOption") envioRate = 0.05;

      localStorage.setItem("envioRate", envioRate);
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      updateResume(cartItems.productos); 
    });
  });

  //Finalizar compra
  const btnFinalizar = document.getElementById("btnFinalizarCompra");
  btnFinalizar.addEventListener("click", finalizarCompra);
});


function generateProductsItems(products) {
    const container = document.getElementById("products-list-container");

    if (products && products.length > 0) {
        let htmlContentToAppend = "";
        for (let product of products) {
            htmlContentToAppend += `
            <div class="list-group-item-cart" data-id="${product.id}">
    <div class="row align-items-stretch">
        <div class="col-sm-6">
            <img src="${product.imgUrl}" class="img-thumbnail img-fluid">
        </div>
        <div class="col">
            <div class="d-flex w-100 justify-content-center">
                <h4 class="mb-1 mt-4">${product.titulo}</h4>
            </div>
            <div class="d-flex flex-column mt-1 mb-2">
                <div class="row align-items-center">
                    <div class="col-6">
                        <p class="mb-1 mt-4 pt-2 fs-5"><b>${product.moneda} ${product.precio}</b></p>
                    </div>
                    <div class="col-6 col-sm-5">
                        <div class="mb-1">
                            <label class="form-label small text-muted">Cantidad</label>
                            <div class="input-group input-group-sm" ">
                                <button class="btn btn-outline-secondary btn-minus" type="button">−</button>
                                <input type="text" class="form-control text-center quantity-input" value="${product.cantidad}" readonly>
                                <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
                            </div>
                        </div>
                     </div>
                </div>
                    <div class="col mt-5">
                        <button type="button" class="btn btn-danger btn-sm btn-delete">Eliminar</button>
                    </div>
               </div>
            </div>
         </div>
      </div>
            `;
        }

        container.innerHTML = htmlContentToAppend;


        const deleteButtons = container.querySelectorAll(".btn-delete");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.closest(".list-group-item-cart").dataset.id;
                deleteProduct(productId);
            });
        });

    } else {
        container.innerHTML = `
            <div id="void-cart-message">
              <p class="mt-3">No hay productos en tu carrito.</p>
            </div>`;
    }
}

function deleteProduct(productId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems"));

    cartItems.productos = cartItems.productos.filter(p => Number(p.id) !== Number(productId));

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    generateProductsItems(cartItems.productos);
    updateResume(cartItems.productos);

    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

function updateResume(products) {
    let htmlContentToAppend = "";
    let subtotal = 0;

    if (!products || products.length === 0) {
        document.getElementById("cart-list-items").innerHTML = `<li class="list-group-item">Carrito vacío</li>`;
        return;
    }

    products.forEach(product => {
        const subTotal = parseInt(product.precio) * parseInt(product.cantidad);
        subtotal += subTotal;
        htmlContentToAppend += `
            <li class="list-group-item d-flex justify-content-between align-items-start bg-secondary">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${product.titulo}</div>
                    Subtotal: ${product.moneda} ${subTotal}
                </div>
                <span class="badge bg-primary rounded-pill">${parseInt(product.cantidad)}</span>
            </li>`;
    });

    const costoEnvio = Math.round(subtotal * envioRate);
    const total = subtotal + costoEnvio;

    htmlContentToAppend += `
        <li class="list-group-item d-flex justify-content-between align-items-start bg-secondary">
            <div class="fw-bold">Subtotal:</div>
            <div>${subtotal}</div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start bg-secondary">
            <div class="fw-bold">Costo de envío (${envioRate * 100 || 0}%):</div>
            <div>${costoEnvio}</div>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start bg-secondary">
            <div class="fw-bold">Total:</div>
            <div>${total}</div>
        </li>`;

    document.getElementById("cart-list-items").innerHTML = htmlContentToAppend;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-plus") || e.target.classList.contains("btn-minus")) {
        const container = e.target.closest(".list-group-item-cart");
        const input = container.querySelector(".quantity-input");
        const productId = container.dataset.id;
        let quantity = parseInt(input.value);

        if (e.target.classList.contains("btn-plus")) {
            quantity++;
        } else if (e.target.classList.contains("btn-minus") && quantity > 1) {
            quantity--;
        }

        input.value = quantity;


        let cartItems = JSON.parse(localStorage.getItem("cartItems"));
        const product = cartItems.productos.find(p => p.id === productId);
        if (product) product.cantidad = quantity;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        updateResume(cartItems.productos);

        if (typeof updateCartBadge === 'function') {
        updateCartBadge();
        }
    }
});

let envioRate = 0;

function finalizarCompra() {
    let errores = [];

    //Validar dirección
    const departamento = document.getElementById("departamento").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const esquina = document.getElementById("esquina").value.trim();

    if (!departamento || !localidad || !calle || !numero || !esquina) {
        errores.push("Completa todos los campos de la dirección de envío.");
    }

    //Validar envío
    const envioSeleccionado = document.querySelector("input[name='optionsEnvio']:checked");
    if (!envioSeleccionado) {
        errores.push("Seleccione una forma de envío.");
    }

    //Validar cantidades
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {productos: []};
    const cantidadesInvalidas = cartItems.productos.some(p => !p.cantidad || p.cantidad <= 0);
    if (cantidadesInvalidas || cartItems.productos.length === 0) {
        errores.push("Cada producto debe tener una cantidad mayor a 0.");
    }

    //Validar forma de pago
    const pagoSeleccionado = document.querySelector("input[name='optionsPago']:checked");
    if (!pagoSeleccionado) {
        errores.push("Selecciona una forma de pago.");
    } else {
        if (pagoSeleccionado.id === "tarjetaOption") {
            const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
            const nombre = document.getElementById("nombre").value.trim();
            const vencimiento = document.getElementById("vencimiento").value.trim();
            const cvv = document.getElementById("cvv").value.trim();
            const cuotas = document.getElementById("cuotas").value;

            if (!numeroTarjeta || !nombre || !vencimiento || !cvv || cuotas === "Cuotas") {
                errores.push("Completa todos los datos de la tarjeta.")
            }
        } else if (pagoSeleccionado.id === "transferenciaOption") {
            const comprobante = document.getElementById("comprobanteFile");
            if (!comprobante || comprobante.files.length === 0) {
                errores.push("Debes adjuntar el comprobante de transferencia.");
            }
        }
    }

    //Mostrar resultado
    if (errores.length > 0) {
        alert("❌ No se puede finalizar la compra:\n\n" + errores.join("\n"));
    } else {
        alert("✅ ¡Compra exitosa! Gracias por tu compra.");
    }
}