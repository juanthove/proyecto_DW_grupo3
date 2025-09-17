const productId = localStorage.getItem("product-id")
const PRODUCT_ID = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
let productInfo;


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_ID).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data
            insertImg(); 
            showProductInfo();
            
            showRelatedProducts();
        }
    });
});

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
    console.log("Mostrando producto:", productInfo);
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