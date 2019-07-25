var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var qs = require('querystring');
var date = require('date-utils');

var app = express();
app.set('views',__dirname + '/ejsdata');
app.set('view engine','ejs');

var newDate = new Date();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  port :'3306',
  database :'my_db'
});


app.use(express.static('./'));

app.get('/',function(req,res) {
    res.render('login')
})
app.post('/login_action',function(req,res) {
    var body = '';
    var username = '';
    var userPW = '';


    req.on('data',function(data) {
      body = body + data;
    });
    req.on('end',function() { //데이터의 끝
      var post = qs.parse(body);
      username = post.id;
      userPW = post.pw;

      var sql =
      connection.query(`SELECT * from user where userId like '${username}' and userPW like '${userPW}'`, function(err, rows, username,userPW) {

      if (err) {
        console.log('Error while performing Query.', err);
        res.writeHead(200);
        res.end('fail');
      }

      else {
        if (rows[0] != undefined) {
            connection.query(`select * from board order by idx`, function(err,result) {
                if (err) { 
                  console.log('mysql Error');
                }
                else {
                  console.log('no Error');
                  res.render('boardlist',{result:result})
                }
              })
        }
        else {
          console.log('undefined Error ', err);
          res.writeHead(200);
          res.end('fail');
        }
      }

      });

    });
   
})
app.get('/signup',function(req,res) {
    res.render('signup')
})
app.post('/signupAction',function(req,res) {
    var body = '';
    var username = '';
    var userPW = '';

    req.on('data',function(data) {
      body = body + data;
    });
    req.on('end',function() {
    var post = qs.parse(body);
    username = post.id;
    userPW = post.pw;

    connection.query(`INSERT INTO user (userId,userPW) VALUES ('${username}','${userPW}')`, function(err, rows, username,userPW) {
    if (err) {
      console.log('Error while performing Query.', err);
      res.render('signup')
    }
    else {
        connection.query(`select * from board order by idx`, function(err,result) {
            if (err) { 
              console.log('mysql Error');
            }
            else {
              console.log('no Error');
              res.render('boardlist',{result:result})
            }
          })
    }
    })
  })
})
app.get('/write',function(req,res) {
    res.render('write')
})
app.post('/write_action',function(req,res) {
    var body = '';
        var title = '';
        var content = '';
        var writer = '';
        var time = newDate.toFormat('YYYY-MM-DD');
        req.on('data',function(data) {
          body = body + data;
        });
        req.on('end',function() {
        var post = qs.parse(body);

        title = post.title;
        writer = post.writer;
        content = post.content;  

        connection.query(`INSERT INTO board (title,writer,content,hit,regdate,moddate) 
        VALUES ('${title}','${writer}','${content}',1,'${time}','${time}')`, function(err, rows, username,userPW) {
        if (err) {
          console.log('Error while performing Query.', err);
          res.render('signup')
        }
        else {
          console.log('Write is success');
          connection.query(`select * from board order by idx`, function(err,result) {
            if (err) { 
              console.log('mysql Error');
            }
            else {
              console.log('no Error');
              res.render('boardlist',{result:result})
            }
          })
        }
        })
      })
})
app.listen(3000,function(){
    console.log("서버가동")
})

