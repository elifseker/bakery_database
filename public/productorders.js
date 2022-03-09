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

