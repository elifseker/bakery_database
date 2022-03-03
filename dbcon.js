var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_sekere',
  password: '3495',
  database: 'cs340_sekere'
});

module.exports.pool = pool;
