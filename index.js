let express = require('express');
let handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
let bodyParser = require('body-parser');
let mysql = require('./dbcon.js');

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 40404);

// home page
app.get('/', function (req, res, next) {
    res.render('home');
});

// employees page
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

// add new employee 
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

// update employee
app.put('/employees', function (req, res, next) {
    mysql.pool.query("UPDATE employees SET employeeFName=?, employeeLName=?, employeePhone=?, employeeManager=? WHERE employeeID=? ",
        [req.body.employeeFName, req.body.employeeLName, req.body.employeePhone, req.body.employeeManager, req.body.employeeID],
        function (err, result) {
            if (err) {
                next(err);
                return;
            }
            let responseData = { "updated rows": result.changedRows };
            res.json(responseData);
        });
});

// delete employee
app.delete('/employees', function (req, res, next) {
    let employeeID = req.body["employeeID"]
    let selectString = "DELETE FROM employees WHERE employeeID = ?"
    let selectParams = [employeeID]
    mysql.pool.query(selectString, selectParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "deleted rows": result.affectedRows };
        res.json(responseData);

    });
});

// customers page
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

// add new customer
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

// orders page
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

// add new order
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

// edit products -- productorders page
app.get('/productorders', function (req, res, next) {
    let orderID = req.query["orderID"];
    let selectString = "SELECT productOrders.orderID, productOrders.productID, products.productName FROM productOrders LEFT JOIN products ON productOrders.productID = products.productID WHERE productOrders.orderID = ? ";
    let selectParams = [orderID];
    mysql.pool.query(selectString, selectParams, function (err, rows, fields) {
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
app.delete('/productorders', function (req, res, next) {
    let productID = req.body["productID"]
    let orderID = req.body["orderID"]
    let selectString = "DELETE FROM productOrders WHERE productID = ? AND orderID = ?"
    let selectParams = [productID, orderID]
    mysql.pool.query(selectString, selectParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "deleted rows": result.affectedRows };
        res.json(responseData);

    });
});

// search a product to add the order
app.get('/productsearch', function (req, res, next) {
    let searchQuery = '%' + req.query["searchQuery"] + '%';

    if (!searchQuery) {
        res.status(400);
        res.json({ 'error': 'Product name is required' });
        res.send();
        return;
    }
    let insertString = "SELECT productID, productName from products where productName LIKE ?";
    let insertParams = [searchQuery];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            console.log("error!")
            return;
        }

        let responseData = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(responseData);
        res.json(responseData);
    })
});

// add product to the order
app.post('/productorders', function (req, res, next) {
    let orderID = req.body["orderID"];
    let productID = req.body["productID"]

    let insertString = "INSERT INTO productOrders (orderID, productID) VALUES (?, ?)";
    let insertParams = [orderID, productID];
    mysql.pool.query(insertString, insertParams, function (err, result) {
        if (err) {
            next(err);
            return;
        }
        let responseData = { "orderID": result.insertId };
        res.json(responseData);
    })
});

// products page
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

// add new product
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

// product categories page
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

// add new category
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


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});