const mysql = require('mysql');

let pool = mysql.createPool({
    "user" : "root",
    "password" : "ctroot",
    "database" : "ecommerce",
    "host" : "localhost",
    "port" : 3306
});

exports.pool = pool;