var gulp = require('../startbootstrap-blog-post-gh-pages/gulpfile.js');
var express = require('express');
var app = express();
var qs = require('querystring');
var mysql = require('mysql');
var session = require('express-session');

// bootstrap 사용.
gulp.build();

// express 엔진. ejs 사용.
app.set('view engine','ejs');

// 세션 설정.
app.use(session({
    secret: '@@keykey',
    resave: true,
    saveUninitialized: true
}));

// 경로 설정.
app.use(express.static(__dirname + '/public'));

// DB
var dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'database',
    database: 'minostagram',
    connectionLimit : 20,
    multipleStatements : true,
    // date 문자열에서 'GMT 09:00'같은 문자열을 뺀 깨끗한 시간
    dateStrings: 'date'
};

// DB 연결 풀
var pool = mysql.createPool(dbConfig);

// 이미지 파일 관리를 위한 모듈
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/uploads');
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({storage: storage});


// 첫 화면.
app.get('/', function(req, res) {
    console.log('==== index');
    
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("Connect DB Error:", err);
            res.status(400).send('Could not get a connection');
        }
        else {
            console.log('connect to minostagram db');

            var sql = "select * from post";
            console.log('Post 조회 SQL: ' + sql);

            conn.query(sql, function(err, results) {
                if (err) {
                    console.error("SQL 실행 Error:", err)
                }

                if (req.session.user) {
                    console.log('로그인: ' + req.session.user.id);
                    res.render('index', {me: req.session.user.id, post: results});
                }
                else {
                    console.log('비로그인');
                    res.render('index', {me: '', post: results});
                }
            });
        }
        conn.release();
    });
});

// 로그인 요청
app.get('/login/form', function(req, res) {
    console.log("==== login/form");
    res.render('login');
});

// 로그인 시도
app.post('/login', function(req, res) {
    console.log('==== login');

    var buf = '';
    req.on('data', function(data) {
        buf += data;
    });

    req.on('end', function() {
        var post = qs.parse(buf);
        console.log('입력된 로그인 정보:', post.id, post.pwd);
        
        // DB user 비교
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error("Connect DB Error:", err);
                res.status(400).send('Could not get a connection');
            }
            else {
                console.log('connect to minostagram db');

                var sql = "select * from users where user_id='" + post.id + 
                    "' and " + "user_pwd='" + post.pwd + "';";
                console.log('로그인 정보 조회 SQL: ' + sql);

                conn.query(sql, function(err, results) {
                    if (err) {
                        console.error('SQL select Error: ', err);
                    }
                    console.log('로그인 정보 조회 결과:', results);

                    // 로그인 실패
                    if (results.length === 0) {
                        console.log('로그인 실패: ' + post.id);
                        res.status(302).send("<script>alert('로그인 실패. 다시 입력해주세요.'); window.location.href='http://localhost:3000/login/form';</script>");
                    }
                    // 로그인 성공
                    else {
                        req.session.user = {
                            id: post.id,
                            pw: post.pwd,
                            name: 'User Name',
                            authorized: true
                        };
                        console.log('로그인 성공: ' + req.session.user.id);
                        res.redirect('/');
                    }
                    conn.release();
                });
            }   
        });
    });
});

// 회원가입 요청
app.get('/register/form', function(req, res) {
    console.log('==== /register/form');
    
    res.render('register');
});

// 회원가입
app.post('/register', function(req, res) {
    console.log('==== register');

    var buf = '';
    req.on('data', function(data) {
        buf += data;
    });

    req.on('end', function() {
        var post = qs.parse(buf);
        console.log('입력된 회원가입 정보:', post.id, post.pwd);

        // DB user 비교
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error('Connect DB Error: ' + err);
                res.end('Connect DB Error: ', err)
            }
            console.log('connect to minostagram db');
            var sql = "insert into users(user_id, user_pwd, user_name, phone) values ('" + 
                post.id + "', '" + post.pwd + "', '" + post.name + "', '" + 
                post.phone0 + "-" + post.phone1 + "-" + post.phone2 + "');";
            console.log('회원가입을 위한 데이터 삽입 SQL: ' + sql);

            conn.query(sql, function(err, result) {
                if (!err) {
                    console.log('회원가입 성공: ' + post.id);
                    res.status(302).send("<script>alert('회원가입 완료. 다시 로그인 해주세요'); window.location.href='http://localhost:3000/';</script>");
                }

                else {
                    console.error('SQL Insert Error: ' + err);
                }
            });
            conn.release();
        });
    });
});

// 로그아웃
app.get('/logout', function(req, res) {
    console.log('==== logout');

    if (req.session.user) {
        console.log('log out: ', req.session.user.id);
        req.session.destroy(function(err) {
            if (err) {
                console.error('Session destroy Error: ', err);
                return;
            }
            console.log('Session destroy Success');
            res.redirect('/');
        });
    }
    else {
        console.log('비로그인');
        res.redirect('/');
    }
});

// 글 쓰기 요청
app.get('/edit', function(req, res) {
    console.log('==== /edit');

    if (req.session.user) {
        console.log('로그인 id: ' + req.session.user.id);
        res.render('edit', {me: req.session.user.id});
    }
    else {
        // 로그인하지 않고 글을 쓸 수 없음.
        res.status(302).send("<script>alert('로그인이 필요합니다.'); window.location.href='http://localhost:3000/login/form';</script>");
    }
});

// 글 쓰기 완료. DB에 저장
app.post('/edit/post_up', upload.single('img'), function(req, res) {
    console.log('==== /edit/post_up');

    if (! req.file) {
        console.log('no img file');
    }

    // DB에 삽입
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }

        console.log('connect to minostagram db');

        // 이미지파일 경로 문자열을 저장하는데 필요
        var filepath = req.file.path;
        filepath = filepath.substr(7).replace(/\\/g, "\/");

        var sql = "insert into post(writer, content, upTime, img_path)" + 
            " values('" + req.session.user.id + "', '" + req.body.content + 
            "', now(), '" + filepath + "');";
        console.log('게시글 저장 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('게시글 저장 완료:', result);
                res.status(302).send("<script>alert('게시글 저장 완료'); window.location.href='http://localhost:3000/';</script>");
            }
            else {
                console.error('SQL Insert Error: ' + err);
            }
        });
        conn.release();
    });
});

// post 자세히 보기
app.get('/post', function(req, res) {
    console.log('==== /post');

    var get = req.query;
    console.log('입력된 글 정보:', get);

    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("Connect DB Error:", err);
            res.status(400).send('Could not get a connection');
        }
        else {
            console.log('connect to minostagram db');

            var sql = "select * from post where idx=" + get.idx + ";";
            console.log('특정 Post 조회 SQL: ' + sql);

            conn.query(sql, function(err, result) {
                if (err) {
                    console.error("SQL 실행 Error:", err)
                }
                console.log('SQL 실행 결과:', result);

                if (req.session.user) {
                    console.log('로그인: ' + req.session.user.id);
                    res.render('post', {me: req.session.user.id, post: result[0]});
                }
                else {
                    console.log('비로그인');
                    res.render('post', {me: '', post: result[0]});
                }
            });
        }
        conn.release();
    });
});

// Web Server 시작.
app.listen(3000, function() {
    console.log("Express server. http://localhost:3000/")
})