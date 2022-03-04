//submit new order form

const newOrderForm = document.querySelector('#orderForm');

newOrderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let employeeIDInput = newOrderForm.elements.employeeID.value;
    let customerIDInput = newOrderForm.elements.customerID.value;
    let orderDateInput = newOrderForm.elements.orderDate.value;
    let orderPriceInput = newOrderForm.elements.orderPrice.value;

    let req = new XMLHttpRequest();
    let payload = {
        'employeeID': employeeIDInput,
        'customerID': customerIDInput,
        'orderDate': orderDateInput,
        'orderPrice': orderPriceInput,
    };

    req.open('POST', '/orders', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let orderInputList = [employeeID, customerID, orderDate, orderPrice];
            let response = JSON.parse(req.response);
            let orderID = response.orderID;
            addRowOrdersTable(orderInputList, orderID);
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to save customer: " + response.error);
        } else {
            alert("failed to save customer!");
        }
    });
    req.send(JSON.stringify(payload));
})

//add new entry to customer table
const addRowOrdersTable = (orderInputList, orderID) => {
    const table = document.querySelector('#ordersTable');
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", orderID);
    table.append(newRow);
    let newCell = document.createElement('td');
    newCell.append(orderID);
    newRow.append(newCell);
    for (i = 0; i < orderInputList.length; i++) {
        let newCell = document.createElement('td');
        newCell.append(orderInputList[i]);
        newRow.append(newCell);
    }
    let newButtonCell = document.createElement('td');
    let editButton = document.createElement('button');
    editButton.append("edit products");
    editButton.setAttribute("class", "btn btn-primary editButton");
    newButtonCell.append(editButton);
    newRow.append(newButtonCell);
    editButton.addEventListener('click', editClick);
}