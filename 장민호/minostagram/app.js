/**
 * @author minho-jang
 */

/****************** Setting *******************/
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
    database: 'gallery',
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

/********************* Page Management ***********************/

// paging variable
var cnt = 0;
var post_cnt = 0;

// 첫 화면.
app.get('/', function(req, res) {
    console.log('==== index');
    cnt = 0;

    doQuery("select * from post order by idx desc limit 15", function(results) {
        if (req.session.user) {
            console.log('로그인: ' + req.session.user.id);
            res.render('index', {me: req.session.user.id, post: results});
        }
        else {
            console.log('비로그인');
            res.render('index', {me: '', post: results});
        }
        cnt++;
    });

    doQuery('select count(*) as pc from post', function(result) {
        post_cnt = result[0].pc;
        
    })
});

// 스크롤을 내리면서 post 추가요청
app.get('/index/morePost', function(req, res) {
    console.log('==== /index/morePost');

    if (post_cnt < cnt*15) {
        res.send('');
    }
    
    else {
        doQuery('select * from post order by idx desc limit ' + cnt*15 + ',15', function(results) {
            res.send(results);
            if (post_cnt > cnt*15) {
                cnt++;
            }
        });
    }
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
        
        var sql = "select * from users where user_id='" + post.id + 
                    "' and " + "user_pwd='" + post.pwd + "';";
        doQuery(sql, function(results) {
            // 로그인 실패
            if (results.length === 0) {
                console.log('로그인 실패: ' + post.id);
                res.status(302).send("<script>alert('로그인 실패. 다시 입력해주세요.'); window.location.href='http://localhost:3000/login/form';</script>");
            }
            // 로그인 성공
            else {
                req.session.user = {
                    id: post.id,
                    authorized: true
                };
                console.log('로그인 성공: ', req.session.user);
                res.redirect('/');
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

        var sql = "insert into users(user_id, user_pwd, user_name, phone) values ('" + 
                post.id + "', '" + post.pwd + "', '" + post.name + "', '" + 
                post.phone0 + "-" + post.phone1 + "-" + post.phone2 + "');";
        doQuery(sql, function(result) {
            if (result.affectedRows != 0) {
                console.log('회원가입 성공: ' + post.id);
                res.status(302).send("<script>alert('회원가입 완료. 다시 로그인 해주세요'); window.location.href='http://localhost:3000/';</script>");
            }

            else {
                console.error('SQL Insert Error: ' + err);
            }
        });
    });
});

// 로그아웃
app.get('/logout', function(req, res) {
    console.log('==== logout');

    if (req.session.user) {
        console.log('log out: ', req.session.user);
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
        res.status(302).send("<script>alert('선택된 이미지가 없습니다.'); window.location.href='http://localhost:3000/';</script>");
    }
    else {
        // 이미지파일 경로 문자열을 저장하는데 필요
        var filepath = req.file.path;
        filepath = filepath.substr(7).replace(/\\/g, "\/");

        var sql = "insert into post(writer, content, upTime, img_path)" + 
                " values('" + req.session.user.id + "', '" + req.body.content + 
                "', now(), '" + filepath + "');";

        doQuery(sql, function(result) {
            if (result.affectedRows != 0) {
                console.log('게시글 저장 완료:', result);
                res.status(302).send("<script>alert('게시글 저장 완료'); window.location.href='http://localhost:3000/';</script>");
            }
            else {
                console.error('SQL Insert Error: ' + err);
                res.send(400);
            }
        });
    }
});

// 글 수정. DB에 반영
app.post('/post/:idx/update', upload.single('img'), function(req, res) {
    console.log('==== /post/:idx/update');

    var sql = "";

    if (! req.file) {
        // 사진을 변경하지 않음
        sql = "update post set upTime=now(), content='" + req.body.content + "' where idx=" + req.params.idx + ";";
    }
    else {
        // 이미지 파일경로를 문자열로 저장하는데 필요
        var filepath = req.file.path;
        filepath = filepath.substr(7).replace(/\\/g, "\/");

        sql = "update post set upTime=now(), content='" + req.body.content + "', img_path='" +
            filepath + "' where idx=" + req.params.idx + ";";
    }

    doQuery(sql, function(result) {
        if (result.affectedRows != 0) {
            console.log('게시글 수정 완료:', result);
            res.status(302).send("<script>alert('게시글 수정 완료'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
        }
        else {
            console.error('SQL Insert Error: ' + err);
            res.send(400);
        }
    });
});

// 글 수정 요청. DB에서 글 정보 불러오기.
app.get('/post/:idx/update/form', upload.single('img'), function(req, res) {
    console.log('==== /post/:idx/update/form');
    
    var sql = "select * from post where idx=" + req.params.idx + ";";

    doQuery(sql, function(result) {
        res.render('post_update', {
            me: req.session.user.id,
            post: result[0]
        });
    });
});


// post 자세히 보기
app.get('/post/:idx', function(req, res) {
    console.log('==== /post/:idx');

    console.log('Request Parameter:', req.params.idx);

    var sql_post = "select * from post where idx=" + req.params.idx + ";";
    doQuery(sql_post, function(result1) {

        var sql_comment = "select * from comments where post_idx=" + req.params.idx + ";";
        doQuery(sql_comment, function(result2) {
            if (req.session.user) {
                console.log('로그인: ' + req.session.user.id);

                var sql_good = "select * from its_good where user_id='" + req.session.user.id + "';";
                doQuery(sql_good, function(result3) {
                    res.render('post', {me: req.session.user.id, 
                        post: result1[0],
                        comment: result2,
                        is_good: isGood(result3, req.params.idx)}
                    );
                });
            }
            else {
                console.log('비로그인');
                res.render('post', {me: '', 
                    post: result1[0],
                    comment: result2,
                    is_good: false}
                );
            }
        });
    });
});

// 댓글 쓰기
app.get('/post/:idx/comment/', function(req, res) {
    console.log("==== /post/:idx/comment");

    var get = req.query;
    console.log('get query:', get);

    if (! req.session.user) {
        console.log('비로그인');
        res.status(302).send("<script>alert('로그인이 필요합니다.'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
    }
    else {
        var sql = "insert into comments(post_idx, writer, content, upTime) values(" + 
            req.params.idx + ", '" + req.session.user.id + "', '" + get.content + "', now());";

        doQuery(sql, function(result) {
            if (result.length != 0) {
                res.status(302).send("<script>alert('댓글이 등록되었습니다.'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
            }
            else {
                res.sendStatus(400);
            }
        });
    }
});

// post 삭제
app.get('/post/:idx/delete', function(req, res) {
    console.log("==== /post/:idx/delete");

    var sql = "delete from post where idx=" + req.params.idx + ";";
    doQuery(sql, function(result) {
        if (result.affectedRows != 0) {
            res.status(302).send("<script>alert('글이 삭제되었습니다.'); window.location.href='http://localhost:3000/';</script>");
        }
    });
});

// 댓글 삭제
app.get('/post/:idx/comment/delete', function(req, res) {
    console.log("==== /post/:idx/comment/delete");

    var get = req.query;
    console.log('get query:', get);

    // 비로그인 이거나, 글쓴이와 현재로그인 id가 다른 경우
    if (!req.session.user || get.writer != req.session.user.id) {
        res.status(302).send("<script>alert('권한이 없습니다.'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
    }
    else {
        var sql = "delete from comments where idx=" + get.comm_idx + ";";
        doQuery(sql, function(result) {
            if (result.affectedRows != 0) {
                res.status(302).send("<script>alert('댓글이 삭제되었습니다.'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
            }
        });
    }
});

// 마이 페이지
app.get('/mypage/:id', function(req, res) {
    console.log('==== /mypage/:id');

    var sql = "select * from post where writer='" + req.params.id + "';";
    doQuery(sql, function(result1) {

        var liked_sql = "select * from post where idx in (select post_idx from its_good where user_id='" + req.params.id + "');";;
        doQuery(liked_sql, function(result2) {
            var logged_in = "";
            if (req.session.user) {
                logged_in = req.session.user.id;
            }

            res.render('mypage', {
                me: logged_in,
                writer: req.params.id, 
                post: result1,
                liked: result2 }
            );
        })

    });
});

// 게시물 좋아요
app.get('/post/:idx/good', function(req, res) {
    console.log('==== /post/:idx/good');

    if (! req.session.user) {
        console.log('비로그인');
        res.status(302).send("<script>alert('로그인이 필요합니다.'); window.location.href='http://localhost:3000/post/" + req.params.idx + "';</script>");
    }

    else {
        console.log('게시물 좋아요');

        var sql_good = "insert into its_good(user_id, post_idx) values ('" + req.session.user.id + "', " + req.params.idx + ");";
        doQuery(sql_good, function(result) {
            if (result.length == 0) {
                res.status(400).send('No Result Error');
            }
            else {
                var sql_goodCount = "update post set good=good+1 where idx=" + req.params.idx + ";";
                doQuery(sql_goodCount, function(result) {
                    
                    res.redirect('/post/' + req.params.idx);
                });
            }
        });
    }
});

// 게시물 좋아요 취소
app.get('/post/:idx/bad', function(req, res) {
    console.log('==== /post/:idx/bad');

    var sql_good = "delete from its_good where post_idx=" + req.params.idx + ";";
    doQuery(sql_good, function(result) {
        if (result.length == 0) {
            res.status(400).send('No Result Error');
        }
        else {
            var sql_goodCount = "update post set good=good-1 where idx=" + req.params.idx + ";";
            doQuery(sql_goodCount, function(result) {
                res.redirect('/post/' + req.params.idx);
            });
        }
    });
});

// Web Server 시작.
app.listen(3000, function() {
    console.log("Express server. http://localhost:3000/")
})


/********************** function made by me **************************/
// SQL을 실행시키고 결과를 처리(func)하는 함수
function doQuery(sql, func) {
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("Connect DB Error:", err);
            res.status(400).send('Could not get a connection');
        }
        else {
            console.log('connect to gallery db');

            console.log('SQL: ' + sql);

            conn.query(sql, function(err, result) {
                if (err) {
                    console.error("SQL 실행 Error:", err);
                    throw new Error('SQL 실행 Error');
                }
                console.log('SQL 실행 결과:', result);

                func(result);
            });
        }
        conn.release();
    });
}

// 이 게시물(kwd)에 좋아요를 눌렀나
function isGood(result, kwd) {
    for (var x in result) {
        console.log("IN for loop: ", result[x]['post_idx']);
        if(result[x]['post_idx'] == kwd) {
            return true;
        }
    }
    console.log("OUT for loop");
    return false;
}