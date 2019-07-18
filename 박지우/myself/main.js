var http = require('http');
var express = require('express');
var app = express();
var url = require('url');
var compression = require('compression');
var mysql = require('mysql');
var template = require('./templates/login.js')
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(session({
  key: 'sid', //세션의 키값
  secret: 'secret', //세션의 비밀 키,  쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
  resave: false, //세션을 항상 저장할지 결정
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}))
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'eraser',
  database: 'login'
});
conn.connect();

app.get('/check', function(req, res, next){
  let session = req.session;
  res.render("/",{
    session : session
  });
});
app.post('/check', function(req,res,next){
  var post = req.body;
  inputid = post.id;
  inputpwd = post.pwd;
  console.log("->", inputid);
  conn.query(`select * from login where id like '${inputid}' and pwd like '${inputpwd}'`, function (error, data, inputid, inputpwd) {
    if (error) {
      throw error;
    }
    if (data.length == 0) {
      res.writeHead(200);
      res.redirect('/');
    }
    req.session.email = post.id;
      res.writeHead(302);
      res.redirect('/check');
})
});
app.get('/', function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (request.session.email) {
    var title = 'LOGIN SUCCESS';
    var content = '';
  }else{
    var title = 'LOGIN';
    var content = `<form action="/check" method="post">
    <table>
      <tr>
        <td>이메일 : </td>
        <td><input type="text" name="id"></td>
      </tr>
      <tr>
        <td>비번 : </td>
        <td><input type="password" name="pwd"></td>
      </tr>
      <tr>
        <td><input type="submit" value="로그인"></td>
      </tr>
    </table>
  </form>`;
  }
    var html = template.HTML(title, content);
    response.writeHead(200);
    response.end(html);
  }
);

app.post('/check', function (req, res) {
    var title = '';
    var body = `<h1>success</h1>`;
    var html = template.HTML(title, body)
    res.writeHead(302);
    res.end(html);
  });
app.listen(3000);