document.addEventListener("DOMContentLoaded", function (e) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    generateProductsItems(cartItems.productos);
    updateResume(cartItems.productos);
});

function generateProductsItems(products) {
    const container = document.getElementById("products-list-container");

    if (products && products.length > 0) {
        let htmlContentToAppend = "";
        for (let product of products) {
            htmlContentToAppend += `
            <div class="list-group-item-cart" data-id="${product.id}">
    <div class="row">
        <div class="col">
            <img src="${product.imgUrl}" class="img-thumbnail">
        </div>
        <div class="col" style="margin-top: 30px">
            <div class="d-flex w-100 justify-content-center">
                <h4 class="mb-1">${product.titulo}</h4>
            </div>
            <div class="d-flex flex-column mt-1 mb-2">
                <div class="row align-items-center">
                    <div class="col-6">
                        <p class="mb-1 mt-4 pt-2 fs-5"><b>${product.moneda} ${product.precio}</b></p>
                    </div>
                    <div class="col-4">
                        <div class="mb-1">
                            <label class="form-label small text-muted">Cantidad</label>
                            <div class="input-group input-group-sm" style="width: 120px;">
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

    cartItems.productos = cartItems.productos.filter(p => p.id !== productId);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    generateProductsItems(cartItems.productos);
    updateResume(cartItems.productos);
}

function updateResume(products) {
    let htmlContentToAppend = "";

    if (products.length === 0) {
        document.getElementById("cart-list-items").innerHTML = `<li class="list-group-item">Carrito vacío</li>`;
        return;
    }

    products.forEach(product => {
        const subTotal = parseInt(product.precio);
        htmlContentToAppend += `<li class="list-group-item d-flex justify-content-between align-items-start bg-secondary">
                <div class="ms-2 me-auto">
                  <div class="fw-bold">${product.titulo}</div>
                  Subtotal: ${subTotal}
                </div>
                <span class="badge bg-primary rounded-pill">${parseInt(product.cantidad)}</span>
              </li>`;
    });

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
    }
});