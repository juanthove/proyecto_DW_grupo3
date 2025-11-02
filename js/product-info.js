const productId = localStorage.getItem("product-id")
const PRODUCT_ID = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
const COMMENTS_ID = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;
let productInfo;
let productsComments;

document.addEventListener("DOMContentLoaded", async function (e) {
    productInfo = await apiCall(PRODUCT_ID);
    let productsCommentsResponse = await apiCall(COMMENTS_ID);
    productsComments = productsCommentsResponse;

    insertImg();
    showProductInfo();
    showRelatedProducts();
    showProductComments();

    document.getElementById('btn-send-comment').addEventListener('click', addNewComment);
});

async function apiCall(url) {
    const response = await getJSONData(url);
    return response.status === "ok" ? response.data : []

};

function insertImg() {
    const imgs = productInfo.images;
    let htmlContentToAppend = "";
    let isActive = true;
    for (const img of imgs) {

        htmlContentToAppend += `
            <div class="carousel-item ${isActive ? "active" : ""}">
      <img class="img-thumbnail" src=${img} alt="img">
    </div>
            `
        isActive = false;

    }
    document.getElementById("carousel-img-insert").innerHTML = htmlContentToAppend;
};

function showProductInfo() {
    document.getElementById("product-name").textContent = productInfo.name;
    document.getElementById("product-price").textContent = `${productInfo.currency} ${productInfo.cost}`;
    document.getElementById("product-sold-count").textContent = `Vendidos: ${productInfo.soldCount}`;
    document.getElementById("product-description").textContent = productInfo.description;
    document.getElementById("product-category").textContent = productInfo.category;
};

function showRelatedProducts() {
    const productosRelacionados = document.getElementById("productosRelacionados");

    productInfo.relatedProducts.forEach(element => {
        let contenedorItem = document.createElement("div");
        contenedorItem.classList.add("list-group-item");
        contenedorItem.addEventListener("click", () => {
            makeSelection(element.id);
        });

        let imagen = document.createElement("img");
        imagen.src = element.image;
        imagen.alt = element.name;
        imagen.classList.add("img-thumbnail");

        let nombre = document.createElement("h5");
        nombre.classList.add("d-flex", "justify-content-center", "info-bg", "mb-1");
        nombre.textContent = element.name;

        contenedorItem.appendChild(imagen);
        contenedorItem.appendChild(nombre);

        productosRelacionados.appendChild(contenedorItem);
    });
}


function makeSelection(id) {
    localStorage.setItem("product-id", id);
    window.location.href = "product-info.html";
};

function starsRating(voteAverage) {

    let htmlStars = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= voteAverage) {
            htmlStars += `
      <span class="fa fa-star checked"></span>
      `;
        } else {
            htmlStars += `
      <span class="fa fa-star"></span>
      `;
        }
    }

    return htmlStars;
}

function showProductComments() {
    const existingComments = document.querySelectorAll('.comment');
    existingComments.forEach(comment => comment.remove());

    productsComments.forEach(c => {
        const commentHTML = `
            <div class="comment mb-3">
                <div class="comments-container">
                    <div class="">${starsRating(c.score)}</div>
                    <div class="">${c.dateTime}</div>
                </div>
                <div class="comments-container">
                    <div class=""><strong>${c.user}:</strong> ${c.description}</div>
                </div>
                <hr>
            </div>
        `;
        document.querySelector('.comment-list').insertAdjacentHTML('afterbegin', commentHTML);
    });
}

function addNewComment() {
    const commentText = document.getElementById('new-comment').value;
    const scoreValue = document.getElementById('barraOpciones').value;

    if (!commentText) {
        alert("Por favor escribe un comentario");
        return;
    }

    const sessionData = JSON.parse(localStorage.getItem('myAppSession'));
    const userName = sessionData && sessionData.logged ? sessionData.user : "Usuario Anónimo";

    const newComment = {
        score: parseInt(scoreValue),
        description: commentText,
        dateTime: new Date().toISOString().split('T')[0],
        user: userName
    };

    const newCommentHTML = `
        <div class="comment mb-3">
            <div class="comments-container">
                <div class="">${starsRating(newComment.score)}</div>
                <div class="">${newComment.dateTime}</div>
            </div>
            <div class="comments-container">
                <div class=""><strong>${newComment.user}:</strong> ${newComment.description}</div>
            </div>
            <hr>
        </div>
    `;

    document.querySelector('.comment-list').insertAdjacentHTML('afterbegin', newCommentHTML);

    document.getElementById('new-comment').value = '';
    document.getElementById('barraOpciones').value = '5';
}

document.addEventListener("DOMContentLoaded", function () {
    const infoArea = document.getElementById("area-info");
    const buyBtn = document.createElement("button");
    buyBtn.textContent = "Comprar";
    buyBtn.classList.add("btn", "btn-success", "mt-3");
    infoArea.appendChild(buyBtn);

    buyBtn.addEventListener("click", () => {
        const product = {
            id: productInfo.id,
            titulo: productInfo.name,
            precio: productInfo.cost,
            moneda: productInfo.currency,
            imgUrl: productInfo.images[0],
            cantidad: 1
        };

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || { productos: [] };

        const existing = cartItems.productos.find(p => p.id === product.id);
        if (existing) {
            existing.cantidad++;
        } else {
            cartItems.productos.push(product);
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        updateCartBadge();

        window.location.href = "cart.html";
    });

    updateCartBadge();
});

function updateCartBadge() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems"));
    let total = 0;

    if (cartItems && cartItems.productos.length > 0) {
        total = cartItems.productos.reduce((acc, p) => acc + p.cantidad, 0);
    }

    const badge = document.getElementById("cart-badge");
    if (badge) badge.textContent = total > 0 ? total : "";
}