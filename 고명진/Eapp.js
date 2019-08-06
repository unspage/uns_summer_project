var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var session = require('express-session');
var qs = require('querystring');
var moment = require('moment');
var mysql = require('mysql');
var sessionId;

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var bodyParser = require('body-parser');
var app = express();
app.set('views', __dirname + '/ejsdata');
app.set('view engine', 'ejs');

app.use(session({
  secret: '1@%24^%$3^*&98&^%$', 
  resave: false,                     
  saveUninitialized: true    
}));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'my_db'
});

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.render('login')
})
app.post('/login_action', function (req, res) {
  var body = '';
  var username = '';
  var userPW = '';

  req.on('data', function (data) {
    body = body + data;
  });
  
  req.on('end', function () { //데이터의 끝
    var post = qs.parse(body);
    username = post.id;
    userPW = post.pw;

    var sql = connection.query(`SELECT * from user where userId like '${username}' and userPW like '${userPW}'`, function (err, rows, username, userPW) {
        
        if (err) {
          console.log('Error while performing Query.', err);
          res.writeHead(200);
          res.end('fail');
        }

        else {
          if (rows[0] != undefined) {
            req.session.name =  post.id;
            res.redirect('http://localhost:3000/boardlist?page=1')
          }
          else {
            console.log('undefined Error ', err);
            res.writeHead(200);
            res.end('fail');
          }
        }

      });

  });

})
app.get('/signup', function (req, res) {
  res.render('signup')
})
app.post('/signupAction', function (req, res) {
  var body = '';
  var username = '';
  var userPW = '';

  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    username = post.id;
    userPW = post.pw;

    connection.query(`INSERT INTO user (userId,userPW) VALUES ('${username}','${userPW}')`, function (err, rows, username, userPW) {
      if (err) {
        console.log('Error while performing Query.', err);
        res.render('signup')
      }
      else {
        res.redirect('http://localhost:3000/')
      }
    })
  })
})
app.get('/write', function (req, res) {
  res.render('write')
})
app.post('/write_action', function (req, res) {
  var body = '';
  var title = '';
  var content = '';
  var writer = '';
  var time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);

    title = post.title;
    writer = post.writer;
    content = post.content;

    connection.query(`INSERT INTO board (title,writer,content,hit,regdate,moddate) 
        VALUES ('${title}','${writer}','${content}',1,'${time}','${time}')`, function (err, rows, username, userPW) {
        if (err) {
          console.log('Error while performing Query.', err);
          res.render('signup')
        }
        else {
          console.log('Write is success');
          res.redirect('http://localhost:3000/boardlist?page=1')
        }
      })
  })

})
app.get('/boardlist', function (req, res) {
  var page = req.query.page; // 쿼리로 들어온 현재 페이지 
  var page_size = 10;
  var page_list_size = 10;
  var totalCount = 0;
  var totalPage = 0;
  var startPage = 0;
  var endPage = 0;
  
  var reulst2;

  if(req.session.count) req.session.count++;
  else  req.session.count = 1;
  
  console.log(req.session.count);

  connection.query(`select count(*) as cnt from board`, function (err, result) {
    if (err) {
      console.log(err + 'mysql totalpage counting error');
      return;
    }
    else {
      totalCount = result[0].cnt;
      totalPage = Math.ceil(totalCount / page_size);
      startPage = Math.round((page - 1) / 10) * 10 + 1;
      endPage = startPage + page_list_size;
      if (totalPage < page_list_size) endPage = totalPage;
      result2 = {
        "page": page,
        "page_size": page_size,
        "page_list_size": page_list_size,
        "totalCount": totalCount,
        "totalPage": totalPage,
        "startPage": startPage,
        "endPage": endPage
      };
    }
  }) 

  var no = (page - 1) * 10;
  connection.query(`select * from board order by idx desc limit ${no},${page_size}`, function (err, result) {
    if (err) {
      console.log('mysql Error');
    }
    else {
      res.render('boardlist', { result: result, result2: result2 })
    }
  })
})
app.get('/boardView', function (req, res) {
  var curPage = req.query.idx;
  connection.query(`select * from board where idx = ${curPage}`, function (err, result) {
    if (err) {
      console.log(err + 'mysql totalpage counting error');
      return;
    }
    else {
      res.render('boardView',{result:result})
    }
  });
  
})
app.post('/comment_action', function (req, res) {
  var writer = '';
  var content = '';
  var time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  var pid;
  var body='';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    writer = "session";
    content = post.content;
    pid = req.query.idx;
    connection.query(`INSERT INTO board_comment (content,Pidx,wirter,date) 
    VALUES ('${content}','${pid}','${writer}','${time}')`, function (err) {
    if (err) {
      console.log('Error while performing Query.', err);
      res.render('boardView')
    }
    else {
      console.log('Comment is success');
      res.redirect(`http://localhost:3000/boardView?idx=${pid}`)
    }
  })
  })

})
app.listen(3000, function () {
  console.log("서버가동")
})

