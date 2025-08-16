let AUTOS_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

let currentProductsArray = [];

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div>
                    <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                </div>
                <div>
                    <div class="d-flex w-100 justify-content-center">
                        <h4 class="mb-1">${product.name}</h4>
                        </div>
                    <div class="d-flex justify-content-between mt-1 mb-2" >
                        <p class="mb-1"><b>${product.currency} ${product.cost}</b></p>
                        <small class="text-muted">${product.soldCount} vendidos</small> 
                    </div>
                    <p class="mb-1 description">${product.description}</p>
                </div>
            </div>
        </div>
        `

    }
    document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(AUTOS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products;
            showProductsList()
        }
    });
});