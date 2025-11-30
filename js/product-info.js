const productId = localStorage.getItem("product-id")
const PRODUCT_ID = `http://localhost:3000/products/${productId}`;
const COMMENTS_ID = `http://localhost:3000/products/products_comments/${productId}`;
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
    const buyBtn = document.getElementById('buttonBuy');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            const productIdStored = localStorage.getItem("product-id");
            const id = productIdStored ? String(productIdStored) : String(productInfo?.id || Date.now());

            const newProduct = {
                id: id, 
                imgUrl: (productInfo && productInfo.images && productInfo.images.length) ? productInfo.images[0] : '',
                titulo: productInfo?.name || '',
                moneda: productInfo?.currency || '',
                precio: String(productInfo?.cost || '0'), 
                cantidad: 1
            };
            // Recuperar cartItems existente o crear uno nuevo
            let cartItems = { productos: [] };
            try {
                const raw = localStorage.getItem('cartItems');
                cartItems = raw ? JSON.parse(raw) : { productos: [] };
                if (!cartItems || !Array.isArray(cartItems.productos)) cartItems = { productos: [] };
            } catch (err) {
                console.warn('cartItems malformado, se reinicia.', err);
                cartItems = { productos: [] };
            }
            // sumar cantidad
            const existing = cartItems.productos.find(p => String(p.id) === id);
            if (existing) {
                existing.cantidad = parseInt(existing.cantidad || 0) + newProduct.cantidad;
            } else {
                cartItems.productos.push(newProduct);
            }
            // Guardar y redirigir
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            if (typeof updateCartBadge === 'function') {
                updateCartBadge();
            }

        });
    }
});

async function apiCall(url) {
    const response = await getJSONData(url);
    return response ? response.data : []

};

function insertImg() {
    const imgs = productInfo.images;
    let htmlContentToAppend = "";
    let isActive = true;
    for (const img of imgs) {

        htmlContentToAppend += `
            <div class="carousel-item ${isActive ? "active" : ""}">
      <img class="d-block w-100 img-fluid" src="${img}" alt="img">
    </div>
            `
        isActive = false;

    }
    document.getElementById("carousel-img-insert").innerHTML = htmlContentToAppend;
};

function showProductInfo() {
    const selectedCurrency = localStorage.getItem("currency") || "USD";
const converted = convertPrice(productInfo.cost, productInfo.currency, selectedCurrency);
    document.getElementById("product-name").textContent = productInfo.name;
   document.getElementById("product-price").textContent = `${selectedCurrency} ${converted.toFixed(2)}`;
    document.getElementById("product-sold-count").textContent = `Vendidos: ${productInfo.sold_count}`;
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

