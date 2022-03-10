//remove product
const removeClick = function () {
    let rowEl = this.parentElement.parentElement;
    let productID = rowEl.dataset.id;

    let req = new XMLHttpRequest();
    let payload = { "productID": productID };
    console.log(payload)

    req.open('DELETE', '/productorders', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            rowEl.remove();
            console.log("deleted the product from the order!");
        } else {
            alert("failed to delete the product from the order!");
        }
    });
    req.send(JSON.stringify(payload));
}

const removeButtonList = document.querySelectorAll('.removeButton');
for (i = 0; i < removeButtonList.length; i++) {
    removeButtonList[i].addEventListener("click", removeClick);
}

//search products
const searchProductForm = document.querySelector('#searchProductForm');

searchProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let productNameInput = searchProductForm.elements.searchProduct.value;
    let req = new XMLHttpRequest();
    let path = "/productsearch?searchQuery=" + productNameInput
    req.open('GET', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let productInput = [productNameInput];
            let response = JSON.parse(req.response);
            if (response == undefined || response.length == 0) {
                alert("no product found!")
                return
            }
            //console.log(response)
            for (const product of response) {
                let productID = product.productID;
                let productName = product.productName
                addRowSearchProductTable(productName, productID);
            }
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to search a product : " + response.error);
        } else {
            alert("failed to search a product!");
        }
    });
    req.send();
})


//add new entry to search product table
const addRowSearchProductTable = (productName, productID) => {
    const table = document.getElementById('searchProductTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", productID);
    table.append(newRow);

    let newProduct = document.createElement('td');
    newProduct.append(productName);
    newRow.append(newProduct);

    let newAddButtonCell = document.createElement('td');
    let addButton = document.createElement('button');
    addButton.append("add product to the order");
    addButton.setAttribute("class", "btn btn-primary addButton");
    newAddButtonCell.append(addButton);
    newRow.append(newAddButtonCell);
    addButton.addEventListener('click', addClick);

}


