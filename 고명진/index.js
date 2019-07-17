var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  port :'3306',
  database :'my_db'
});

connection.connect();

connection.query('SELECT * from Persons',function(err,rows,fields){
  if (!err)
    console.log('The solution is ',rows);
  else
    console.log('Error while performing Query.',err);
});

connection.end();
