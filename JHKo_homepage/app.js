var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = require(__dirname + '/routes/sql_con');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'guiltygearXrd_Rev2_Ky_Kiske',  //이 값을 이용해서 암호화
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/account', require('./routes/account'));
app.use('/board1', require('./routes/board1'));
app.use(function(req, res, next)    {
    res.locals.user = req.session.user;
    next();
})

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/account/login.html'));
});

app.listen(3000);