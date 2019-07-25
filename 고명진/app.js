var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var qs = require('querystring');
var date = require('date-utils');

var exp = express();
var newDate = new Date();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  port :'3306',
  database :'my_db'
});

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var id = queryData.id;
    var pw = queryData.pw;

    connection.query(`select * from board order by idx`, function(err,result) {
      if (err) { 
        console.log('mysql Error');
      }
      else {
        console.log('no Error');
      }
    })

    if(pathname === '/'){
      fs.readFile(`data/login.html`, 'utf8', function(err, description){
        response.writeHead(200);
        response.end(description);
        console.log('root')
      });


    }
    else if (pathname === '/login_action') {

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
            fs.readFile(`data/boardlist.html`,'utf8',function(err,description) {
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
      fs.readFile(`data/signup.html`, 'utf8', function(err, description){
        response.writeHead(200);
        response.end(description);
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
          fs.readFile(`data/signup.html`, 'utf8', function(err, description){
            response.writeHead(200);
            response.end(description);
          })
        }
        else {
          fs.readFile(`data/login.html`, 'utf8', function(err, description){
            response.writeHead(200);
            response.end(description);
        
          })
        }
        })
      })
    }
    else if (pathname == '/write') {
    fs.readFile(`data/write.html`, 'utf8', function(err, description){
      response.writeHead(200);
      response.end(description);
    });
    }
    else if (pathname == '/write_action') {
        var body = '';
        var title = '';
        var content = '';
        var writer = '';
        var time = newDate.toFormat('YYYY-MM-DD');
        request.on('data',function(data) {
          body = body + data;
        });
        request.on('end',function() {
        var post = qs.parse(body);

        title = post.title;
        writer = post.writer;
        content = post.content;  

        connection.query(`INSERT INTO board (title,writer,content,hit,regdate,moddate) 
        VALUES ('${title}','${writer}','${content}',1,'${time}','${time}')`, function(err, rows, username,userPW) {
        if (err) {
          console.log('Error while performing Query.', err);
          fs.readFile(`data/signup.html`, 'utf8', function(err, description){
            response.writeHead(200);
            response.end(description);
          })
        }
        else {
          console.log('Write is success');
          fs.readFile(`data/boardlist.html`, 'utf8', function(err, description){
            response.writeHead(200);
            response.end(description);
        
          })
        }
        })
      })
    }

    else {
      response.writeHead(404);
      response.end('Not found');
    }
  
});
app.listen(3000);
