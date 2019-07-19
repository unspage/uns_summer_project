var express = require('express');
var mysql = require('mysql');
var session = require('express-session');

var bodyParser = require('body-parser');//POST 방식 전송을 위해서 필요함

var app = express();


var dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123123',
  database: 'person'
}

var boardConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123123',
  database: 'board'
}

var conn = mysql.createConnection(dbConfig);
conn.connect();

var conn2 = mysql.createConnection(boardConfig);
conn2.connect();

app.use(bodyParser.urlencoded({extended: false}));//미들웨어 등록부분

//resave 세션아이디를 접속할때마다 발급하지 않는다

app.use(session({

secret: '12312dajfj23rj2po4$#%@#',

resave: false,

saveUninitialized: true

}));

var boardRouter = require('./boardRouter.js')
app.use(boardRouter)

app.post('/login', function(req, res){

var id = req.body.userEmail;
var pwd = req.body.password;
var sql = 'SELECT * FROM users WHERE email=?';
var user;
conn.query(sql, [id], function(err, result){
  if(err){console.log(err);}
  if(!result[0]){return res.send('please check your id or password');}
  user = result[0];
  console.log(result[0]);
  if(id === user.email && pwd === user.password){//아이디와 패스워드 둘다 같으면

  res.redirect('/list');

  }else{//비밀번호가 틀리면

  res.send('who are you?<a href="/">login</a>');

  }
});


});



app.get('/', function(req, res){

var output = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>


  <h3>로그인</h3>
  <form action="/login" method="post">
    <table>
      <tr>
        <td>이메일 : </td>
        <td><input type="text" name="userEmail"></td>
      </tr>
      <tr>
        <td>비번 : </td>
        <td><input type="password" name="password"></td>
      </tr>
      <tr>
        <td><input type="submit" value="로그인"></td>
      </tr>
    </table>
    <tr>
      <td>
      <a href=./register>
      <button type="button">회원가입</button></a></td>
    </tr>
  </form>


</body>
</html>
`;
res.send(output);
});

app.get('/register', function(req, res){
    var output =`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Document</title>
    </head>
    <body>
      <form action="/register" method="post">
        name : <input type="text" name="name"><br>
        email : <input type="text" name="email"><br>
        password : <input type="text" name="password"><br>
        <input type="submit">
      </form>
    </body>
    </html>
    `;
    res.send(output);
});

app.post('/register', function(req, res){
  var today = new Date();
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var created = today;
  var modified = today;
  conn.query('insert into users (name, email, password, created, modified) values ("'+name+'","'+email+'","'+password+'","'+created+'","'+modified+'")', function(err, result, fields){
    if(err){console.log(err);}
    console.log("data inserted!");
    res.send("register success!");
  });
});

app.get('/list', function(req,res){
  res.redirect('/list/1');
});

app.get('/list/:page', function(req, res){
  var query = conn2.query('select title,writer,hit,regdate from list',function(err,rows){
    if(err){console.log(err);}
    console.log('rows:'+ rows);
    res.render('list', {title:'Board List', rows:rows});
  });
});

app.listen(3000, function(){

console.log('Connected 3000 port!!!');

});
