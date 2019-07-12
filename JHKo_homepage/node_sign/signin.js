var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    port: '3306',
    user     : 'root',
    password : 'eclair0829!',
    database : 'account_data'
});

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));



app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/signin.html'));
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
            }*/
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/go_to_login', function(request, response) {
    response.redirect('../node_login/login.html');
});

app.listen(3000);