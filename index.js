let express = require('express');
let handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
let bodyParser = require('body-parser');
let mysql = require('./dbcon.js');
//let dateFormat = require("dateformat");

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 40404);

app.get('/', function (req, res, next) {
    res.render('home');
});

//select
app.get('/employees', function (req, res, next) {
    let selectString = "SELECT * FROM employees";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('employees', { "rows": rows });
    })
});

app.get('/customers', function (req, res, next) {
    let selectString = "SELECT * FROM customers";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('customers', { "rows": rows });
    })
});

app.get('/orders', function (req, res, next) {
    let selectString = "SELECT * FROM orders";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('orders', { "rows": rows });
    })
});

app.get('/products', function (req, res, next) {
    let selectString = "SELECT * FROM products";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('products', { "rows": rows });
    })
});

app.get('/productcategories', function (req, res, next) {
    let selectString = "SELECT * FROM productCategories";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('productcategories', { "rows": rows });
    })
});

//insert
app.post('/employees', function (req, res, next) {
    let employeeFName = req.body["employeeFName"];
    let employeeLName = req.body["employeeLName"];
    let employeePhone = req.body["employeePhone"];
    let employeeManager = req.body["employeeManager"];
    if (!employeeFName) {
        res.status(400);
        res.json({ 'error': 'Employee name is required' });
        res.send();
        return;
    }
    let insertString = "INSERT INTO employees (employeeFName, employeeLName, employeePhone, employeeManager) VALUES (?, ?, ?, ?)";
    let insertParams = [employeeFName, employeeLName, employeePhone, employeeManager];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "employeeID": result.insertId };
        res.json(responseData);
    })
});

app.post('/customers', function (req, res, next) {
    let customerFName = req.body["customerFName"];
    let customerLName = req.body["customerLName"];
    let customerPhone = req.body["customerPhone"];
    let customerEmail = req.body["customerEmail"];
    let customerZIP = req.body["customerZIP"];
    if (!customerFName) {
        res.status(400);
        res.json({ 'error': 'Customer name is required' });
        res.send();
        return;
    }
    let insertString = "INSERT INTO customers (customerFName, customerLName, customerPhone, customerEmail, customerZIP) VALUES (?, ?, ?, ?, ?)";
    let insertParams = [customerFName, customerLName, customerPhone, customerEmail, customerZIP];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "customerID": result.insertId };
        res.json(responseData);
    })
});

app.post('/orders', function (req, res, next) {
    let employeeID = req.body["employeeID"];
    let customerID = req.body["customerID"];
    let orderDate = req.body["orderDate"];
    let orderPrice = req.body["orderPrice"];
    if (!employeeID) {
        res.status(400);
        res.json({ 'error': 'Employee ID is required' });
        res.send();
        return;
    }
    let insertString = "INSERT INTO orders (employeeID, customerID, orderDate, orderPrice) VALUES (?, ?, ?, ?)";
    let insertParams = [employeeID, customerID, orderDate, orderPrice];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "orderID": result.insertId };
        res.json(responseData);
    })
});

app.post('/products', function (req, res, next) {
    let productName = req.body["productName"];
    let productPrice = req.body["productPrice"];
    let productCalorie = req.body["productCalorie"];
    let productCategory = req.body["productCategory"];

    if (!productName) {
        res.status(400);
        res.json({ 'error': 'Product name is required' });
        res.send();
        return;
    }
    let insertString = "INSERT INTO products (productName, productPrice, productCalorie, productCategory) VALUES (?, ?, ?, ?)";
    let insertParams = [productName, productPrice, productCalorie, productCategory];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "productID": result.insertId };
        res.json(responseData);
    })
});

app.post('/productcategories', function (req, res, next) {
    let categoryName = req.body["categoryName"];

    if (!categoryName) {
        res.status(400);
        res.json({ 'error': 'Category Name is required' });
        res.send();
        return;
    }
    let insertString = "INSERT INTO productCategories (categoryName) VALUES (?)";
    let insertParams = [categoryName];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "categoryID": result.insertId };
        res.json(responseData);
    })
});

// edit products -- productorders page
app.get('/productorders', function (req, res, next) {
    let orderID = req.query["orderID"];
    let selectString = "SELECT productOrders.productID, products.productName FROM productOrders LEFT JOIN products ON productOrders.productID = products.productID WHERE productOrders.orderID = ? ";
    let selecttParams = [orderID];
    mysql.pool.query(selectString, selecttParams, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('productorders', {
            "orderID": orderID,
            "rows": rows
        });
    })
});

// remove product




app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});