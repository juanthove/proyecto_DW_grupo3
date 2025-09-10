const productId = localStorage.getItem("product-id")
const PRODUCT_ID = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
let productInfo;


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_ID).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data
            insertImg(); 
            showProductInfo();
            
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
};