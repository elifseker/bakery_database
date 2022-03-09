

//submit form product categories

const newProductCategoryForm = document.querySelector('#productCategoriesForm');

newProductCategoryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let categoryNameInput = newProductCategoryForm.elements.categoryName.value;

    let req = new XMLHttpRequest();
    let payload = {
        'categoryName': categoryNameInput,
    };

    req.open('POST', '/productcategories', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            let categoryInput = [categoryNameInput];
            let response = JSON.parse(req.response);
            let categoryID = response.categoryID;
            addRowProductCategoriesTable(categoryInput, categoryID);
            console.log("form submitted!");
        } else if (req.status == 400) {
            let response = JSON.parse(req.response);
            alert("failed to save product category: " + response.error);
        } else {
            alert("failed to save product category!");
        }
    });
    req.send(JSON.stringify(payload));
})


//add new entry to product category table
const addRowProductCategoriesTable = (categoryInput, categoryID) => {
    const table = document.getElementById('productCategoriesTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", categoryID);
    table.append(newRow);

    let newCell = document.createElement('td');
    newCell.append(categoryID);
    newRow.append(newCell);

    let newCategory = document.createElement('td');
    newCategory.append(categoryInput);
    newRow.append(newCategory);
}
