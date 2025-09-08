let currentProductsArray = [];
let filteredProductsArray = [];
const AUTOS_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

function showProductsList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

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

document.getElementById("filterButton").addEventListener("click", () => {
    const min = parseInt(document.getElementById("minPrice").value) || 0;
    const max = parseInt(document.getElementById("maxPrice").value) || Infinity;

    filteredProductsArray = currentProductsArray.filter(p => p.cost >= min && p.cost <= max);
    showProductsList(filteredProductsArray);
});

document.getElementById("clearButton").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    filteredProductsArray = [...currentProductsArray];
    showProductsList(filteredProductsArray);
});

document.querySelectorAll(".sort-buttons button")[0].addEventListener("click", () => {
    filteredProductsArray.sort((a, b) => a.cost - b.cost); 
    showProductsList(filteredProductsArray);
});

document.querySelectorAll(".sort-buttons button")[1].addEventListener("click", () => {
    filteredProductsArray.sort((a, b) => b.cost - a.cost); 
    showProductsList(filteredProductsArray);
});

document.querySelectorAll(".sort-buttons button")[2].addEventListener("click", () => {
    filteredProductsArray.sort((a, b) => b.soldCount - a.soldCount); 
    showProductsList(filteredProductsArray);
});

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(AUTOS_URL).then(function(resultObj){   
        if (resultObj.status === "ok"){
            document.getElementById("textProduct").innerHTML = `Verás aqui todos los productos de la categoria ${resultObj.data.catName}`;
            currentProductsArray = resultObj.data.products;
            filteredProductsArray = [...currentProductsArray];
            showProductsList(filteredProductsArray);
        }
    });
});