const util = require('util');
const mysql = require('mysql');

const pool = mysql.createPool({//mysql연결
    connectionLimit: 10,
    host: 'localhost',
    user: 'root', 
    password: '3819', 
    database: 'web',
    dateStrings: 'date'
});

pool.getConnection((err, connection) => {
    if(err) 
        console.error("database err");
    
    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
