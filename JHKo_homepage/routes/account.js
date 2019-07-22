var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var connection = require(__dirname + '/sql_con');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.get('/', function(request, response) {
    var username = requuest.body.username;
    if(request.session.loggedIn)    {
        request.session.username = username;
        response.redirect('/board1/list');
    }
    else    {
        response.sendFile(path.join(__dirname + '/../views/account/login.html'));
    }
});

router.get('/login_page', function(request, response) {
    response.sendFile(path.join(__dirname + '/../views/account/login.html'));
});

router.post('/auth', function(request, response) {
    console.log('Login btn clicked');
    var username = request.body.username;
    var password = request.body.password;
    var curPage = request.body.curPage;
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
                console.log('session.username: ' + request.session.username);
                //var session_name = request.session.username;
                //var obj = {"session_name":session_name};    //views 폴더에 위치한 html에 오브젝트를 전달

                request.session.save(() =>  {
                    response.redirect('/board1/list?cur='+curPage);
                });
            } else {
                response.send('Incorrect Username and/or Password!');
                response.redirect('/');
            }
        });
    } else {
        response.send('Please enter Username and Password!');
        response.render(__dirname + '/../views/account/login.html');
    }
});

router.post('/signin', function(request, response)    {
    response.sendFile(path.join(__dirname + '/../views/account/signin.html'));
});

router.get('/signin_page', function(request, response) {
    response.sendFile(path.join(__dirname + '/../views/account/signin.html'));
});

router.post('/signin_pro', function(request, response) {
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

router.get('/go_to_login', function(request, response) {
    response.redirect('/');
});

router.post('/cancel', function(request, response) {
    console.log('cancel btn clicked');
    response.redirect('/account/login_page');
});

module.exports=router;