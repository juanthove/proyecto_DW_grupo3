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
    getJSONData(`${PRODUCTS_URL}${localStorage.getItem("catID")}${EXT_TYPE}`).then(function(resultObj){
        if (resultObj.status === "ok"){
            document.getElementById("textProduct").innerHTML = `Verás aqui todos los productos de la categoria ${resultObj.data.catName}`;
            currentProductsArray = resultObj.data.products;
            showProductsList()
        }
    });
});