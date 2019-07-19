var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var bodyParser = require('body-parser')
var ejs = require('ejs')

router.use(bodyParser.urlencoded({ extended: false}))

router.get("/list/:cur", function (req, res){
  var page_size = 10;
  var page_list_size = 10;
  var no = "";
  var totalPageCount = 0;

  var queryString = 'select count(*) as cnt from list'
  getConnection().query(queryString, function(error2, data){
    if(error2){console.log(error2 + "mysql 조회 실패");return}
    totalPageCount = data[0].cur;
    var curPage = req.params.cur;
    console.log("현재 페이지 : "+curPage, "전체 페이지 : "+totalPageCount);

    if(totalPageCount<0){totalPageCount=0}

    var totalPage = Math.ceil(totalPageCount / page_size);
    var totalSet = Math.ceil(totalPage / page_list_size);
    var curSet = Math.ceil(curPage /  page_list_size);
    var startPage = ((curSet - 1) * 10) + 1
    var endPage = (startPage + page_list_size) -1;

    if(curPage < 0){no=0}
    else{no=(curPage-1)*10}

    console.log('[0] curPage : ' + curPage+ ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage);

    var result2 = {
      "curPage": curPage,
      "page_list_size": page_list_size,
      "page_size": page_size,
      "totalPage": totalPage,
      "totalSet": totalSet,
      "curSet": curSet,
      "startPage": startPage,
      "endPage": endPage
    };

    fs.readFile('list.html', 'utf-8', function (error, data) {

      if (error) {console.log("ejs오류" + error);return;}
      console.log("몇번부터 몇번까지" + no)

      var queryString = 'select * from list order by writer desc limit ?,?';
      getConnection().query(queryString, [no, page_size], function (error, result) {
        if (error) {console.log("페이징 에러" + error);return;}
        res.send(ejs.render(data, {
          data: result,
          pasing: result2
        }));
      });
    });


  });
});

router.get("/delete/:title", function (req, res) {
console.log("삭제 진행")

getConnection().query('delete from list where title = ?', [req.params.title], function () {
res.redirect('/list')
});

})
//삽입 페이지
router.get("/insert", function (req, res) {
console.log("삽입")

fs.readFile('./insert.html', 'utf-8', function (error, data) {
res.send(data)
});
});
//삽입 포스터 데이터
router.post("/insert", function (req, res) {
console.log("삽입 포스트 데이터 진행")
var body = req.body;
getConnection().query('insert into list(title,content,writer) values (?,?,?)', [body.title, body.content, body.writer], function () {
//응답
res.redirect('/list');
})

})
//수정 페이지
router.get("/edit/:title", function (req, res) {
console.log("수정 진행")

fs.readFile('./edit.html', 'utf-8', function (error, data) {
getConnection().query('select * from list where title = ?', [req.params.title], function (error, result) {
res.send(ejs.render(data, {
data: result[0]
}))
})
});

})
//수정 포스터 데이터
router.post("/edit/:title", function (req, res) {
console.log("수정 포스트 진행")
var body = req.body;
getConnection().query('update list set title = ?, content = ? where title = ?',
[body.title, body.content, req.params.title], function () {
res.redirect('/list')
})
})


//글상세보기
router.get("/detail/:title", function (req, res) {
console.log("디테일")

fs.readFile('./detail.html', 'utf-8', function (error, data) {
  console.log("file read.")
getConnection().query('select * from list where title = ?', [req.params.title], function (error, result) {
res.send(ejs.render(data, {
data: result[0]
}))
})
});


})







var conn2 = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'board'
});
function getConnection(){
  return conn2
}

module.exports = router
