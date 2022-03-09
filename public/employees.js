//submit new employee form

const newEmployeeForm = document.querySelector('#employeeForm');

newEmployeeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let employeeFNameInput = newEmployeeForm.elements.employeeFName.value;
    let employeeLNameInput = newEmployeeForm.elements.employeeLName.value;
    let employeePhoneInput = newEmployeeForm.elements.employeePhone.value;
    let employeeManagerInput = document.querySelector('input[name = "employeeManager"]:checked').value;

    let req = new XMLHttpRequest();
    let payload = {
        'employeeFName': employeeFNameInput,
        'employeeLName': employeeLNameInput,
        'employeePhone': employeePhoneInput,
        'employeeManager': employeeManagerInput,
    };

    req.open('POST', '/employees', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let inputList = [employeeFNameInput, employeeLNameInput, employeePhoneInput, employeeManagerInput];
            let response = JSON.parse(req.response);
            let employeeID = response.employeeID;
            addRowEmployeesTable(inputList, employeeID);
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to save employee: " + response.error);
        } else {
            alert("failed to save employee!");
        }
    });
    req.send(JSON.stringify(payload));
})

//add new entry to employees table
const addRowEmployeesTable = (inputList, employeeID) => {
    const table = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", employeeID);
    table.append(newRow);
    let newCell = document.createElement('td');
    newCell.append(employeeID);
    newRow.append(newCell);

    for (i = 0; i < inputList.length; i++) {
        let newCell = document.createElement('td');
        newCell.append(inputList[i]);
        newRow.append(newCell);
    }
    let newUpdateButtonCell = document.createElement('td');
    let newDeleteButtonCell = document.createElement('td');
    let updateButton = document.createElement('button');
    updateButton.append("update");
    updateButton.setAttribute("class", "btn btn-primary updateButton");
    let deleteButton = document.createElement('button');
    deleteButton.append("delete");
    deleteButton.setAttribute("class", "btn btn-primary deleteButton");
    newUpdateButtonCell.append(updateButton);
    newDeleteButtonCell.append(deleteButton);
    newRow.append(newUpdateButtonCell);
    newRow.append(newDeleteButtonCell);
    updateButton.addEventListener('click', updateClick);
    deleteButton.addEventListener('click', deleteClick);
}

//delete employee
const deleteClick = function () {
    let rowEl = this.parentElement.parentElement;
    let employeeID = rowEl.dataset.id;

    let req = new XMLHttpRequest();
    let payload = { "employeeID": employeeID };

    req.open('DELETE', '/employees', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            rowEl.remove();
            console.log("deleted the employee!");
        } else {
            alert("failed to delete the employee!");
        }
    });
    req.send(JSON.stringify(payload));
}

const deleteButtonList = document.querySelectorAll('.deleteButton');
for (i = 0; i < deleteButtonList.length; i++) {
    deleteButtonList[i].addEventListener("click", deleteClick);
}
