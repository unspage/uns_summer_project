var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  port :'3306',
  database :'my_db'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting : ' + err.stack);
    return ;
  }
  console.log('connected as id '+ connection.threadId);
});


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var id = queryData.id;
    var pw = queryData.pw;


    if((pathname === '/') && (queryData.id == undefined)){

      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 -</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
          <form action = "http://localhost:3000/create_process" method = "post">
            <p><input type="text" name="id" value="" placeholder = "intput ID"></p>
            <p><input type="text" name="pw" value="" placeholder = "intput PW"></p>
            <p>
              <input type ="submit" value = "SignIn">
              <input type ="button" value = "SignUp" onclick="location.href='http://localhost:3000/signup'">
            </p>
          </form>
          </ul>
          <h2></h2>
          <p></p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    }
    else if (pathname === '/create_process') {

      var body = '';
      var username = '';
      var userPW = '';


      request.on('data',function(data) {
        body = body + data;
      });
      request.on('end',function() { //데이터의 끝
        var post = qs.parse(body);
        username = post.id;
        userPW = post.pw;

        var sql =
        connection.query(`SELECT * from user where userId like '${username}' and userPW like '${userPW}'`, function(err, rows, username,userPW) {
        if (err) {
          console.log('Error while performing Query.', err);
          response.writeHead(200);
          response.end('fail');
        }
        else {
          if (rows[0] != undefined) {
            console.log('userID = ',rows[0].userId);
            console.log('userPW = ',rows[0].userPW);
            fs.readFile(`board/HTML.html`,'utf8',function(err,description) {
              response.writeHead(200);
              response.end(description);
            });


          }
          else {
            console.log('undefined Error ', err);
            response.writeHead(200);
            response.end('fail');
          }
        }


        });

      });

    }
    else if (pathname === '/signup') {
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var template = `
        <!doctype html>
        <html>
        <head>
          <title> SIGNUP PAGE -</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/signup">SIGNUP PAGE</a></h1>
          <ul>
          <form action = "http://localhost:3000/signupAction" method = "post">
            <p><input type="text" name="id" value="" placeholder = "Intput new ID"></p>
            <p><input type="text" name="pw" value="" placeholder = "Intput new PW"></p>
            <p>
              <input type ="submit" value = "SignUp">
            </p>
          </form>
          </ul>
          <h2></h2>
          <p></p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    }
      else if (pathname === '/signupAction') {
        var body = '';
        var username = '';
        var userPW = '';

        request.on('data',function(data) {
          body = body + data;
        });
        request.on('end',function() {
        var post = qs.parse(body);
        username = post.id;
        userPW = post.pw;
        connection.query(`INSERT INTO user (userId,userPW) VALUES ('${username}','${userPW}')`, function(err, rows, username,userPW) {
        if (err) {
          console.log('Error while performing Query.', err);
          response.writeHead(200);
          response.end('fail');
        }
        else {
            response.writeHead(200);
            response.end('success');
        }



        });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
