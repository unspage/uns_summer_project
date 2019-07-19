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
    resave: true,
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

/*app.get('/login_page', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/account/login.html'));
});

app.post('/auth', function(request, response) {
    console.log('Login btn clicked');
    var username = request.body.username;
    var password = request.body.password;
    console.log('ID: ' + username + ' password: ' + password);
    if (username && password) {
        connection.query('SELECT username, password FROM account_info WHERE username = ? AND password = ?', [username, password], function(error, results, fields)        {
            if(error)   {
                console.log(error);
            }
            else if (results.length>0) {
                console.log(results);
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/board1/list');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.post('/signin', function(request, response)    {
    response.sendFile(path.join(__dirname + '/views/account/signin.html'));
});

app.get('/signin_page', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/account/signin.html'));
});

app.post('/signin_pro', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var real_name = request.body.real_name;
    var gender = request.body.gender;
    var mail_front = request.body.mail_front;
    var mail_back = request.body.mail_back;
    var mail_add = mail_front + "@" + mail_back;

    console.log('ID: ' + username + '\npassword: ' + password + '\nreal_name: ' + real_name + '\ngender: ' + gender + '\nmail_front: ' + mail_front + '\nmail_back: ' + mail_back + '\nmail_add: ' + mail_add);
    if (username && password && real_name && gender && mail_front && mail_back) {
        connection.query('INSERT INTO account_info (username, password, real_name, gender, mail_add) VALUES (?, ?, ?, ?, ?)', [username, password, real_name, gender, mail_add], function(error, results, fields)   {
            if(error)   {
                console.log(error);
            }
            else    {
                console.log(results);
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/go_to_login');
            }
            /*else if (results.length>0) {
                console.log(results);
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/go_to_login');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/go_to_login', function(request, response) {
    response.redirect('/');
});

app.post('/cancel', function(request, response) {
    console.log('cancel btn clicked');
    response.redirect('/');
});*/

app.listen(3000);