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

// update employee
let rowBeforeEdit = {}
//update button
const updateClick = function () {
    let rowEl = this.parentElement.parentElement;
    let employeeID = rowEl.dataset.id;

    //backup values before editing
    let cells = rowEl.children;
    rowBeforeEdit.employeeFName = cells[1].innerText;
    rowBeforeEdit.employeeLName = cells[2].innerText;
    rowBeforeEdit.employeePhone = cells[3].innerText;
    rowBeforeEdit.employeeManager = cells[4].innerText;

    //add input boxes into td's
    cells[1].innerHTML = '';
    let newEmployeeFNameInput = document.createElement('input');
    newEmployeeFNameInput.setAttribute('type', 'text');
    newEmployeeFNameInput.setAttribute('id', 'editEmployeeFName');
    newEmployeeFNameInput.setAttribute('value', rowBeforeEdit.employeeFName);
    cells[1].append(newEmployeeFNameInput);

    cells[2].innerHTML = '';
    let newEmployeeLNameInput = document.createElement('input');
    newEmployeeLNameInput.setAttribute('type', 'text');
    newEmployeeLNameInput.setAttribute('id', 'editEmployeeLName');
    newEmployeeLNameInput.setAttribute('value', rowBeforeEdit.employeeLName);
    cells[2].append(newEmployeeLNameInput);

    cells[3].innerHTML = '';
    let newEmployeePhoneInput = document.createElement('input');
    newEmployeePhoneInput.setAttribute('type', 'tel');
    newEmployeePhoneInput.setAttribute('id', 'editEmployeePhone');
    newEmployeePhoneInput.setAttribute('value', rowBeforeEdit.employeePhone);
    cells[3].append(newEmployeePhoneInput);

    cells[4].innerHTML = '';
    let newNoInput = document.createElement('input');
    newNoInput.setAttribute('type', 'radio');
    newNoInput.setAttribute('id', 'editNo');
    newNoInput.setAttribute('name', 'editEmployeeManager');
    newNoInput.setAttribute('value', '0');
    let newYesInput = document.createElement('input')
    newYesInput.setAttribute('type', 'radio');
    newYesInput.setAttribute('id', 'editYes');
    newYesInput.setAttribute('name', 'editEmployeeManager');
    newYesInput.setAttribute('value', '1');
    if (rowBeforeEdit.employeeManager === '0') {
        newNoInput.setAttribute('checked', 'true');
    } else {
        newYesInput.setAttribute('checked', 'true');
    }
    cells[4].append(newNoInput, 'No', newYesInput, 'Yes');

    //hide update and delete buttons
    cells[5].querySelector('.updateButton').setAttribute('hidden', 'true');
    cells[6].querySelector('.deleteButton').setAttribute('hidden', 'true');

    //add save and cancel buttons
    let saveButton = document.createElement('button');
    saveButton.setAttribute('class', 'btn btn-primary saveButton');
    saveButton.append('save');
    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('class', 'btn btn-primary cancelButton');
    cancelButton.append('cancel');
    cells[5].append(saveButton);
    cells[6].append(cancelButton);
    //save and cancel buttons eventlistener
    saveButton.addEventListener('click', saveClick);
    cancelButton.addEventListener('click', cancelClick);

}
const saveClick = function () {
    let rowEl = this.parentElement.parentElement;
    let employeeID = rowEl.dataset.id;
    let editEmployeeFName = rowEl.querySelector('#editEmployeeFName').value;
    let editEmployeeLName = rowEl.querySelector('#editEmployeeLName').value;
    let editEmployeePhone = rowEl.querySelector('#editEmployeePhone').value;
    let editEmployeeManager = document.querySelector('input[name = "editEmployeeManager"]:checked').value;
    //let editEmployeeManager = rowEl.querySelectorAll('#editEmployeeManager');


    //ajax call using inputs in the row
    let req = new XMLHttpRequest();
    let payload = {
        "employeeID": employeeID,
        "employeeFName": editEmployeeFName,
        "employeeLName": editEmployeeLName,
        "employeePhone": editEmployeePhone,
        "employeeManager": editEmployeeManager,
    };
    req.open('PUT', '/employees', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let editList = [editEmployeeFName, editEmployeeLName, editEmployeePhone, editEmployeeManager];
            let response = JSON.parse(req.response);
            updateRow(rowEl, editList);
            console.log("form editted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to edit the employee: " + response.error);
        } else {
            alert("failed to edit the employee!");
        }
    });
    req.send(JSON.stringify(payload));
}

//when ajax succeed make row read only again
const updateRow = function (rowEl, editList) {
    let cells = rowEl.children;
    let FNameCell = cells[1].querySelector('input')
    FNameCell.remove();
    cells[1].append(editList[0]);

    let LNameCell = cells[2].querySelector('input')
    LNameCell.remove();
    cells[2].append(editList[1]);

    let phoneCell = cells[3].querySelector('input')
    phoneCell.remove();
    cells[3].append(editList[2]);

    let managerCell = cells[4].querySelector('input')
    managerCell.remove();
    cells[4].innerHTML = '';
    cells[4].append(editList[3]);


    cells[5].querySelector('.updateButton').removeAttribute('hidden');
    cells[6].querySelector('.deleteButton').removeAttribute('hidden');
    cells[5].querySelector('.saveButton').remove();
    cells[6].querySelector('.cancelButton').remove();
}

const cancelClick = function () {
    let rowEl = this.parentElement.parentElement;
    let employeeID = rowEl.dataset.id;
    let cells = rowEl.children;
    cells[1].innerText = rowBeforeEdit.employeeFName;
    cells[2].innerText = rowBeforeEdit.employeeLName;
    cells[3].innerText = rowBeforeEdit.employeePhone;
    cells[4].innerText = rowBeforeEdit.employeeManager;
    cells[5].querySelector('.updateButton').removeAttribute('hidden');
    cells[6].querySelector('.deleteButton').removeAttribute('hidden');
    cells[5].querySelector('.saveButton').remove();
    cells[6].querySelector('.cancelButton').remove();
}

const updateButtonList = document.querySelectorAll('.updateButton');
for (i = 0; i < updateButtonList.length; i++) {
    updateButtonList[i].addEventListener("click", updateClick);
}


