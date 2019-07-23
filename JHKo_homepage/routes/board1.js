var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var pool = require(__dirname + '/sql_con');
var session = require('express-session');
var url = require('url');

//페이징 용 함수
function paging_calc(curPage, totalPostCnt) {
    var page_size = 10; //페이지당 게시물 수 = 10개
    var page_list_size = 5;    //최대 보여주는 페이지의 갯수 = 5개
    var no = "";    //limit 변수

    if (totalPostCnt < 0 )  {
        totalPostCnt = 0
    }

    var totalPostCnt = totalPostCnt;
    var totalPage = Math.ceil(totalPostCnt / page_size);    //전체 페이지의 갯수
    var totalSet = Math.ceil(totalPage / page_list_size);   // 전체 세트 수
    var curSet = Math.ceil(curPage / page_list_size);   // 현재 세트의 번호
    var startPage = ((curSet - 1) * 10) + 1 // 현재 세트 내 출력될 시작 페이지
    var endPage = (startPage + page_list_size) - 1; //현재 세트 내 출력될 마지막 페이지

    //현재 페이지가 0보다 작으면
    if (curPage < 0)    {
        no = 0;
    }
    // 0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
    else    {
        no = (curPage - 1) * 10;
    }

    var result2 = {
        "totalPostCnt": totalPostCnt,
        "curPage": curPage,
        "page_list_size": page_list_size,
        "page_size": page_size,
        "totalPage": totalPage,
        "totalSet": totalSet,
        "curSet": curSet,
        "startPage": startPage,
        "endPage": endPage
    };

    return result2;
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.get('/', function(req, res, next) {
    res.redirect('/board1/list');
});

router.get('/home', function(request, response) {
    console.log('board_list print');
});

//페이징 기능 구현 Part
router.get('/list', function(req,res,next){
    console.log('게시판 목록 출력');
    session_name = req.session.username;

    var totalPostCnt = 0;   //전체 게시물의 숫자
    var result2;
    var curPage = req.param("cur");

    if (curPage == undefined)   {
        curPage = 1;
    }

    pool.getConnection(function (err, connection) {
        var sql_cnt = "SELECT count(*) as post_cnt FROM post_data";
        connection.query(sql_cnt, function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));
            totalPostCnt = rows[0].post_cnt;

            result2 = paging_calc(curPage, totalPostCnt);

            console.log("현재 페이지: " + curPage, "전체 페이지: " + totalPostCnt);
            connection.release();
        });
    });

    pool.getConnection(function (err, connection) {
        var sql = "SELECT post_num, post_title, username, post_date, post_views" +
            " FROM post_data";
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));
            res.render('board1/list', {
                rows: rows?rows:{},
                paging: result2
            });
            connection.release();
        });
    });
});

//향후에 조회수 증가 추가 예정
router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT post_num, post_content, post_title, username, post_date" +
            " FROM post_data" + " WHERE post_num=" + req.query.post_num; +
        console.log("rows : " + sql);
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('board1/read', {row: rows[0]});
            connection.release();
        });
    });
});

router.get('/form', function(req,res,next){
    if (!req.query.post_num) {
        res.render('board1/form', {row: ""});
        return;
    }
    console.log('board_form print');
    console.log('session.username: ' + req.session.username);
    session_name = req.session.username;

    if(session_name==undefined) {
        alert();
        res.render('account/login.html');
    }

    pool.getConnection(function (err, connection) {
        var sql = "SELECT post_num, post_title, post_content, username, post_date" +
            " FROM post_data" +
            " WHERE post_num=" + req.query.post_num;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('board1/form', {row: rows[0]});
            connection.release();
        });
    });
});

router.post('/save', function(req,res,next){
    var data = [req.body.post_title, req.body.post_content, session_name, req.body.post_num];
    console.log("rows : " + data);
    console.log("post_title: " + req.body.post_title);
    console.log("post_content " + req.body.post_content);
    console.log("session_username: " + session_name);

    pool.getConnection(function (err, connection) {
        var sql = "INSERT INTO post_data(post_title, post_content, username, post_date) VALUES('"+req.body.post_title+"','"+req.body.post_content+"','"+session_name+"',NOW())";
        connection.query(sql, data, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('list');
            connection.release();
        });
    });
});

router.post('/save_edit', function(req,res,next){
    var data = [req.body.post_title, req.body.post_content, session_name, req.body.post_num];
    console.log("수정 실행 중");
    console.log("post_title: " + req.body.post_title);
    console.log("post_content " + req.body.post_content);
    console.log("post_num: " + req.body.post_num);

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE post_data SET post_title='"+req.body.post_title+"', post_content='"+req.body.post_content+"', post_date=NOW() WHERE post_num="+req.body.post_num;
        console.log("sql: " + sql);
        connection.query(sql, data, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('list');
            connection.release();
        });
    });
});

router.get('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "DELETE FROM post_data" +
            " WHERE post_num=" + req.query.post_num;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('list');
            connection.release();
        });
    });
});

router.get('/edit', function(req,res,next){
    if (!req.query.post_num) {
        res.render('board1/form', {row: ""});
        return;
    }
    console.log('board_form print');
    console.log('session.username: ' + req.session.username);
    session_name = req.session.username;

    if(session_name==undefined) {
        alert();
        res.render('account/login.html');
    }

    pool.getConnection(function (err, connection) {
        var sql = "SELECT post_num, post_title, post_content, username, post_date" +
            " FROM post_data" +
            " WHERE post_num=" + req.query.post_num;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('board1/edit', {row: rows[0]});
            connection.release();
        });
    });
});

module.exports=router;