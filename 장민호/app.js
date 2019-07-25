var express = require('express');
var app = express();
var qs = require('querystring');
var mysql = require('mysql');
var session = require('express-session');

// 파일 참조 설정.
app.use(express.static(__dirname + '/public'));

// 세션 설정.
app.use(session({
    secret: '@@keykey',
    resave: true,
    saveUninitialized: true
}));

// DB
var dbConfig = {
    host: 'localhost',
    user:'root',
    password:'database',
    database:'mydb',
    // date 문자열에서 'GMT 09:00'같은 문자열을 뺀 깨끗한 시간
    dateStrings: 'date'
};

// DB 연결 풀
var pool = mysql.createPool(dbConfig);

// express 엔진, 폴더 경로 설정.
app.set('view engine','ejs');
app.set('views','./views_ejs');

// 첫 화면. 로그인 창.
app.get('/', function(req, res){
    console.log('==== main');
    
    if (req.session.user) {
        console.log('이미 로그인 되어 있음: ' + req.session.user.id);
        res.redirect('/board');
    }
    else {
        res.render('login');
    }
});

// 로그인. post 방식
app.post('/login', function(req,res) {
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
            console.log('connect to mydb');

            var sql = "select * from users where user_id='" + post.id + 
                "' and " + "user_pwd='" + post.pwd + "';";
            console.log('로그인 정보 조회 SQL: ' + sql);

            conn.query(sql, function(err, results) {
                if (err) {
                    console.error('SQL Run Error: ', err);
                }
                console.log('로그인 정보 조회 결과:', results);

                // 로그인 실패
                if (results.length === 0) {
                    console.log('로그인 실패: ' + post.id);
                    res.status(302).send("<script>alert('로그인 실패. 다시 입력해주세요.'); window.location.href='http://localhost:3000/';</script>");
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
                    res.redirect('/board');
                }
                conn.release();
            });
        });
    });
});

// 로그 아웃.
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
        console.log('로그인 되어 있지 않음');
        res.redirect('/');
    }
});

// 회원가입 요청
app.get('/register/form', function(req, res) {
    res.render('register');
});

// 회원가입. post 방식.
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
            console.log('connect to mydb');
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

// 게시판 출력.
app.get('/board', function(req, res) {
    console.log('==== board');
    
    if (req.session.user) {     // 로그인 되어있는 상태이면,
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error('Connect DB Error: ' + err);
                res.end('Connect DB Error: ', err)
            }
            console.log('connect to mydb');
            var sql = "select * from board order by _time desc;";
            console.log('게시판 가져오는 SQL: ' + sql);

            conn.query(sql, function(err, results) {
                if (!err) {
                    console.log("게시판 출력 results", results);
                    res.render('board', {me: req.session.user.id, board: results});
                }
                else {
                    console.error('SQL Error: ' + err);
                }
            });
            conn.release();
        });
        
    }
    else {
        console.log("로그인을 하지 않고 게시판 접근 시도");
        res.status(302).send("<script>alert('로그인 해주세요'); window.location.href='http://localhost:3000/';</script>");
    }
});

// 글쓰기 요청
app.get('/board/edit/form', function(req, res) {
    console.log('==== board/edit/form');

    if (! req.session.user) {
        console.log('로그인 되어 있지 않음.');
        res.redirect('/');
    }
    else { 
        res.render('edit', {me: req.session.user.id});
    }
});

// 글쓰기 완료. DB에 삽입
app.get('/board/edit', function(req, res) {
    console.log('==== board/edit');

    var get = req.query;
    console.log('입력된 글 정보:', get);

    // DB에 게시글 삽입.
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }
        console.log('connect to mydb');
        
        var sql = "insert into board(title, _time, writer, content) values('" +
            get.title + "', now(), '" + get.id + "', '" + get.content + "');"; 
        console.log('게시판에 데이터를 삽입하는 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('글쓰기 완료: ' + get.id);
                res.status(302).send("<script>alert('글이 등록되었습니다.'); window.location.href='http://localhost:3000/board';</script>");
            }
            else {
                console.error('SQL Insert Error: ' + err);
            }
        });
        conn.release();
    });
});

// 게시글 내용 보기.
app.get('/board/content', function(req, res) {
    console.log('==== board/content');

    var get = req.query;
    console.log('요구하는 글 정보:', get);

    // DB 게시판 조회
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }
        console.log('connect to mydb');
        
        var sql = "select * from board where idx=" + get.idx + ";"; 
        console.log('게시글을 조회하는 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('게시글 조회: ', result);
                res.render('content', {me: req.session.user.id, data: result[0]});
            }
            else {
                console.error('SQL Insert Error: ' + err);
            }
        });
        conn.release();
    });
});

// 게시글 삭제
app.get('/board/content/delete', function(req, res) {
    console.log('==== board/content/delete');

    var get = req.query;
    console.log('삭제하는 글 정보:', get);

    // DB 게시글 삭제
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }
        console.log('connect to mydb');
        
        var sql = "delete from board where idx=" + get.idx + ";"; 
        console.log('게시글을 삭제하는 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('게시글 삭제: ', result);
                res.redirect('/board');
            }
            else {
                console.error('SQL delete Error: ' + err);
            }
        });
        conn.release();
    });
});

// 게시글 수정 요청
app.get('/board/content/update/form', function(req, res) {
    console.log('==== board/content/update/form');
    
    var get = req.query;
    console.log('수정하는 글 정보:', get);

    // DB에서 수정할 게시글 불러오기
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }
        console.log('connect to mydb');
        
        var sql = "select * from board where idx=" + get.idx + ";"; 
        console.log('수정할 게시글을 조회하는 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('SQL 조회 결과: ', result);
                res.render('update', {me: req.session.user.id, data: result[0]});
            }
            else {
                console.error('SQL select Error: ' + err);
            }
        });
        conn.release();
    });
    
});

// 게시글 수정 완료
app.get('/board/content/update', function(req, res) {
    console.log('==== board/content/update');

    var get = req.query;
    console.log('수정하는 글 정보:', get);

    // DB 게시글 수정
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('Connect DB Error: ' + err);
            res.end('Connect DB Error: ', err)
        }
        console.log('connect to mydb');
        
        var sql = "update board set title='" + get.title + "', _time=now(), writer='" + 
            get.id + "', content='" + get.content + "' where idx=" + get.idx + ";"; 
        console.log('게시글을 수정하는 SQL: ' + sql);

        conn.query(sql, function(err, result) {
            if (!err) {
                console.log('게시글 수정: ', result);
                res.status(302).send("<script>alert('글이 수정되었습니다.'); window.location.href='http://localhost:3000/board/content?idx=" + get.idx + "'</script>");
            }
            else {
                console.error('SQL delete Error: ' + err);
            }
        });
        conn.release();
    });
});

app.listen(3000,function(){
  console.log('server running at http://loaclhost:3000/');
});