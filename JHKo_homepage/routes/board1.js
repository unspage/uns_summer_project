var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var pool = require(__dirname + '/sql_con');
var session = require('express-session');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.get('/', function(req, res, next) {
    res.redirect('/board1/list');
});

router.get('/home', function(request, response) {
    console.log('board_list print');
});

router.get('/list', function(req,res,next){
    console.log('board_list print');
    console.log('session.username: ' + req.session.username);
    session_name = req.session.username;
    pool.getConnection(function (err, connection) {
        var sql = "SELECT post_num, post_title, username, post_date, post_views" +
            " FROM post_data";
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));
            console.log(rows);
            res.render('board1/list', {rows: rows?rows:{}});
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

module.exports=router;