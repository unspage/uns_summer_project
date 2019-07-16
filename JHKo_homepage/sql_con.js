var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    port: '3306',
    user     : 'root',
    password : 'eclair0829!',
    database : 'account_data'
});

var pool = mysql.createPool({
    connectionLimit: 5,
    host    : 'localhost',
    user    : 'root',
    password    : 'eclair0829!',
    database    : 'account_data'
});

module.exports = connection
module.exports = pool