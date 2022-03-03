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

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/employees', function (req, res) {
    let selectString = "SELECT * FROM employees";
    mysql.pool.query(selectString, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.render('employees', { "rows": rows });
    })
});

app.get('/customers', function (req, res) {
    res.render('customers');
});

app.get('/orders', function (req, res) {
    res.render('orders');
});

app.get('/products', function (req, res) {
    res.render('products');
});

app.get('/productcategories', function (req, res) {
    res.render('productcategories');
});

app.get('/productorders', function (req, res) {
    res.render('productorders');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});