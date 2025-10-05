const productId = localStorage.getItem("product-id")
const PRODUCT_ID = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
const COMMENTS_ID = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;
let productInfo;
let productsComments;
console.log(COMMENTS_ID)

document.addEventListener("DOMContentLoaded", async function (e) {
    productInfo = await apiCall(PRODUCT_ID);
    let productsCommentsResponse = await apiCall(COMMENTS_ID);
    productsComments = productsCommentsResponse;

    insertImg();
    showProductInfo();
    showRelatedProducts();
    showProductComments();


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

function showProductComments() {
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = "";

    productsComments.forEach(c => {
        commentsContainer.innerHTML += `
      <div class="comment mb-3">
       <div id="rating-date">
        <p>${starsRating(c.score)}</p>
        <p>${c.dateTime}</p>
       </div>
       <div id="user-comment">
        <p class="me-2">
        <strong>${c.user}:</strong>
        </p>
        <p>${c.description}</p>
       </div>
       <hr>
    `;
    });
}

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