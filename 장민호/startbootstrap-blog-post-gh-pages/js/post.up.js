var mysql = require('mysql');

// DB
var dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'database',
    database: 'mydb',
    connectionLimit : 10,
    multipleStatements : true,
    // date 문자열에서 'GMT 09:00'같은 문자열을 뺀 깨끗한 시간
    dateStrings: 'date'
};

// DB 연결 풀
var pool = mysql.createPool(dbConfig);

