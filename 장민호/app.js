var express = require('express');
var app = express();
var qs = require('querystring');
var mysql = require('mysql');

// DB
var dbConfig = {
    host: 'localhost',
    user:'root',
    password:'database',
    database:'mydb'
};

// DB 연결 풀
var pool = mysql.createPool(dbConfig);

// express 엔진, 폴더 경로 설정.
app.set('view engine','ejs');
app.set('views','./views_ejs');

app.get('/',function(req, res){
  res.render('login');
});

// 로그인. post 방식
app.post('/login', function(req,res) {
    var buf = '';
    req.on('data', function(data) {
        buf += data;
    });

    req.on('end', function() {
        var post = qs.parse(buf);
        console.log(post.id, post.pwd);
        
        // DB user 비교
        pool.getConnection(function(err, conn) {
            console.log('connect to mydb');
            var sql = "select * from users where user_id='" + post.id + 
                "' and " + "user_pwd='" + post.pwd + "';";

            console.log(sql);
            conn.query(sql, function(err, results) {
                if (err) {
                    console.error('sql select error: ', err);
                }
                console.log('result: ', results);
                if (results.length === 0) {
                    res.writeHead(200);
                    res.end('no result');
                }
                else {
                    res.writeHead(200);
                    res.end(results[0].user_id);
                }
                conn.release();
            });
        });
    });
});

// 회원가입
app.get('/register', function(req, res) {
    var buf = '';
    req.on('data', function(data) {
        buf += data;
    });

    req.on('end', function() {
        var get = qs.parse(buf);
        console.log(get.id, get.pwd);
        
        var sql = "select * from users where user_id='" + get.id + ";";
        console.log(sql);

        // DB user 비교
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error('register SQL Error: ' + err);
                res.end('SQL Error')
            }
            console.log('connect to mydb');
            sql = "insert into users values (" + //TODO id(기본키) 결정
                ", " + get.id + ", " + get.pwd + ";";
            console.log(sql);

            //TODO DB에 삽입.

        });
    });
});

app.listen(3000,function(){
  console.log('server running at http://loaclhost:3000/');
});