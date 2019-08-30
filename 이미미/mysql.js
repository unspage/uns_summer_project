var mysql      = require('mysql'); 
var connection = mysql.createConnection({
  host     : 'localhost',
  port:3306,
  user     : 'root',
  password : '3819',
  database : 'web'
});
  
connection.connect();

connection.query('SELECT *  FROM list', function (error, result, fields) {//첫번째sql 두번째 콜백
  if (error) {
      console.log(error);
  }
  console.log(result[0]);
});

connection.end();
