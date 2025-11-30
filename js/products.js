let filteredProductsArray = [];
let relReverse = false;

function showProductsList(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];
        // Convertir el precio según la moneda seleccionada
        const selectedCurrency = localStorage.getItem("currency") || "USD";
        const converted = convertPrice(product.cost, product.currency, selectedCurrency);

        htmlContentToAppend += `
        <div class="col-12 list-group-item" id="${product.id}" onclick="makeSelection(${product.id})">
            <div>
                <div>
                    <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                </div>
                <div>
                    <div class="d-flex w-100 justify-content-center">
                        <h4 class="mb-1">${product.name}</h4>
                        </div>
                    <div class="d-flex justify-content-between mt-1 mb-2" >
                        <p class="mb-1"><b>${selectedCurrency} ${converted.toFixed(2)}</b></p>
                        <small>${product.sold_count} vendidos</small> 
                    </div>
                    <p class="mb-1 description">${product.description}</p>
                </div>
            </div>
        </div>
        `

    }
    document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

function makeSelection(id) {
    localStorage.setItem("product-id", id);
    window.location.href = "product-info.html";

};

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
    if (relReverse) {
        filteredProductsArray.sort((a, b) => b.sold_count - a.sold_count);
        relReverse = false;
    } else {
        filteredProductsArray.sort((a, b) => a.sold_count - b.sold_count);
        relReverse = true;
    }

    showProductsList(filteredProductsArray);
});

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(`${PRODUCTS_URL}${localStorage.getItem("catID")}`).then(function (resultObj) {
        if (resultObj.status === "ok") {
            document.getElementById("textProduct").innerHTML = `Verás aqui todos los productos de la categoria ${resultObj.data.catName}`;
            currentProductsArray = resultObj.data.products;
            filteredProductsArray = [...currentProductsArray];
            showProductsList(filteredProductsArray);
        }
    });
});

// Buscador en tiempo real
document.getElementById("searchInput").addEventListener("input", () => {
    const searchText = document.getElementById("searchInput").value.toLowerCase();

    const searchedArray = filteredProductsArray.filter(product =>
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText)
    );

    showProductsList(searchedArray);
});
