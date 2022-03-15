//submit new product form
const newProductForm = document.querySelector('#productForm');

newProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let productNameInput = newProductForm.elements.productName.value;
    let productPriceInput = newProductForm.elements.productPrice.value;
    let productCalorieInput = newProductForm.elements.productCalorie.value;
    let productCategoryInput = newProductForm.elements.productCategory.value;

    let req = new XMLHttpRequest();
    let payload = {
        'productName': productNameInput,
        'productPrice': productPriceInput,
        'productCalorie': productCalorieInput,
        'productCategory': productCategoryInput,
    };

    req.open('POST', '/products', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let productInputList = [productNameInput, productPriceInput, productCalorieInput, productCategoryInput];
            let response = JSON.parse(req.response);
            let productID = response.productID;
            addRowProductsTable(productInputList, productID);
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to save product: " + response.error);
        } else {
            alert("failed to save product!");
        }
    });
    req.send(JSON.stringify(payload));
})

//add new entry to customer table
const addRowProductsTable = (productInputList, productID) => {
    const table = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", productID);
    table.append(newRow);

    let newCell = document.createElement('td');
    newCell.append(productID);
    newRow.append(newCell);

    for (i = 0; i < productInputList.length; i++) {
        let newCell = document.createElement('td');
        newCell.append(productInputList[i]);
        newRow.append(newCell);
    }
}