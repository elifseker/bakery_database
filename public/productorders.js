//remove product
const removeClick = function () {
    let rowEl = this.parentElement.parentElement;
    let productID = rowEl.dataset.id;
    let orderID = rowEl.dataset.orderid;
    let req = new XMLHttpRequest();
    let payload = { "productID": productID, "orderID": orderID };
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
    //let rowEl = this.parentElement.parentElement;
    //let orderID = rowEl.dataset.orderid;
    let elif = document.querySelector('#searchProductTable');
    let orderID = elif.dataset.orderid;
    console.log(orderID);
    let productNameInput = searchProductForm.elements.searchProduct.value;
    let req = new XMLHttpRequest();
    let path = "/productsearch?searchQuery=" + productNameInput;
    req.open('GET', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        //clearSearchProductTable();

        if (req.status >= 200 && req.status < 400) {
            //let productNameInput = [productNameInput];
            let response = JSON.parse(req.response);
            if (response == undefined || response.length == 0) {
                alert("no product found!");
                return;
            }

            for (const product of response) {
                let productID = product.productID;
                let productName = product.productName;

                addRowSearchProductTable(productName, productID, orderID);
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
const addRowSearchProductTable = (productName, productID, orderID) => {
    const table = document.getElementById('searchProductTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", productID);
    newRow.setAttribute("data-orderid", orderID);
    table.append(newRow);

    let newProduct = document.createElement('td');
    newProduct.setAttribute("id", "resultSearch")
    newProduct.append(productName);
    newRow.append(newProduct);

    let newAddButtonCell = document.createElement('td');
    let addButton = document.createElement('button');
    addButton.append("add product to the order");
    addButton.setAttribute("class", "btn btn-primary addButton");
    addButton.setAttribute("id", "addProductOrder")
    addButton.setAttribute("data-orderid", orderID)
    newAddButtonCell.append(addButton);
    newRow.append(newAddButtonCell);
    addButton.addEventListener('click', addClick);

}

// add product to the order
const addClick = function () {
    let rowEl = this.parentElement.parentElement;
    let productID = rowEl.dataset.id;
    let orderID = rowEl.dataset.orderid;
    let productName = document.getElementById("resultSearch").innerHTML;
    let req = new XMLHttpRequest();
    let payload = {
        'orderID': orderID,
        'productID': productID,
    };
    //console.log(payload)
    req.open('POST', '/productorders', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            addRowProductsInOrderTable(orderID, productID, productName);
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to add product: " + response.error);
        } else {
            alert("failed to add product!");
        }
    });
    req.send(JSON.stringify(payload));
};

//add new entry to products in order# table
const addRowProductsInOrderTable = (orderID, productID, productName) => {
    const table = document.getElementById('productsInOrderTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-orderid", orderID);
    newRow.setAttribute("data-id", productID);
    table.append(newRow);
    let newCell = document.createElement('td');
    newCell.append(productID);
    newRow.append(newCell);

    let newProductCell = document.createElement('td');
    newProductCell.append(productName);
    newRow.append(newProductCell);

    let newButtonCell = document.createElement('td');
    let removeButton = document.createElement('button');
    removeButton.append("remove product");
    removeButton.setAttribute("class", "btn btn-primary removeButton");
    newButtonCell.append(removeButton);
    newRow.append(newButtonCell);
}



