var mysql      = require('mysql'); 
var connection = mysql.createConnection({
  host     : 'localhost',
  //port:3306,
  user     : 'root',
  password : '3819',
  database : 'page'
});
  
connection.connect();
  
connection.query('SELECT * FROM customer', function (error, results, fields) {//첫번째sql 두번째 콜백
    if (error) {
        console.log(error);
    }
    console.log(results);
});
  
connection.end();
