var express = require('express');

var session = require('express-session');

var bodyParser = require('body-parser');//POST 방식 전송을 위해서 필요함

var app = express();

app.use(bodyParser.urlencoded({extended: false}));//미들웨어 등록부분

//resave 세션아이디를 접속할때마다 발급하지 않는다

app.use(session({

secret: '12312dajfj23rj2po4$#%@#',

resave: false,

saveUninitialized: true

}));

 

app.post('/auth/login', function(req, res){

var user = {//현재 유저는 한개만 있음

username:'uns',

password:'111'

};

var uname = req.body.username;//POST방식으로 보낸 값을 가져옴

var pwd = req.body.password;

if(uname === user.username && pwd === user.password){//아이디와 패스워드 둘다 같으면

res.redirect('/welcome');

}else{//비밀번호가 틀리면

res.send('who are you?<a href="/auth/login">login</a>');

}

});

 

app.get('/auth/login', function(req, res){

var output = `

<h1>Login</h1>

<form action="/auth/login" method="post">

<p>

<input type="text" name="username" placeholder="username">

</p>

<p>

<input type="password" name="password" placeholder="password">

</p>

<p>

<input type="submit">

</p>

</form>

`;

res.send(output);

});

app.get('/welcome', function(req, res){
	var output=`
	<h1>Hello uns</h1>
	<form action="/welcome" method="post">
	<p>
	<h2>Good Day</h2>
	</p>
	</form>
	`;
	res.send(output);
});

app.listen(3003, function(){

console.log('Connected 3003 port!!!');

});