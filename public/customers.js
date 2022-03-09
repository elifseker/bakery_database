//submit new customer form

const newCustomerForm = document.querySelector('#customerForm');

newCustomerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let customerFNameInput = newCustomerForm.elements.customerFName.value;
    let customerLNameInput = newCustomerForm.elements.customerLName.value;
    let customerPhoneInput = newCustomerForm.elements.customerPhone.value;
    let customerEmailInput = newCustomerForm.elements.customerEmail.value;
    let customerZIPInput = newCustomerForm.elements.customerZIP.value;

    let req = new XMLHttpRequest();
    let payload = {
        'customerFName': customerFNameInput,
        'customerLName': customerLNameInput,
        'customerPhone': customerPhoneInput,
        'customerEmail': customerEmailInput,
        'customerZIP': customerZIPInput,
    };

    req.open('POST', '/customers', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let customerInputList = [customerFNameInput, customerLNameInput, customerPhoneInput, customerEmailInput, customerZIPInput];
            let response = JSON.parse(req.response);
            let customerID = response.customerID;
            addRowCustomersTable(customerInputList, customerID);
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
const addRowCustomersTable = (customerInputList, customerID) => {
    const table = document.getElementById('customersTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", customerID);
    table.append(newRow);

    let newCell = document.createElement('td');
    newCell.append(customerID);
    newRow.append(newCell);

    for (i = 0; i < customerInputList.length; i++) {
        let newCell = document.createElement('td');
        newCell.append(customerInputList[i]);
        newRow.append(newCell);
    }
}