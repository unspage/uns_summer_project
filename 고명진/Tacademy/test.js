var express = require('express');
var app = express();


// 라우팅
app.listen(3000);
app.get('/dup',function(req,res) { // post로 바꾸면 post도 가능
  res.send('Hello dup!');
  console.log(req.query); //쿼리 문자열
  console.log(req.path); // url 경로
  console.log(req.params); // url 파라미터

  //res.download() : 파일 다운로드
  //res.redirect() : 리다이렉션 응답 전송

});
app.get('/one',function(req,res) {
  res.send('Hello one!');
});

/*
app.use(sayHello); //미들웨어
function sayHello(req,res,next) {
  res.send('Hello Express!');
  next();
}
*/
app.use(function(req,res,next) {
  var now = new Date();
  console.log(now.toDateString()+'-url:'+req.url);
  next();
});

app.use(function(req,res) {
  res.send('Hello Express!!');
})
