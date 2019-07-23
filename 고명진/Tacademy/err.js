var express = require('express');
var morgan = require('morgan');
var app = express();


app.use(morgan('dev'));
app.get('/:value',work);
app.use(errorHandler);

app.listen(3000);

function work(req,res,next) {
  var val = parseInt(req.params.value);

  if (!val) {
    var error = new Error('입력값이 숫자가 아닙니다.')
    next(error);
    return;
  }
  res.send('Result : ' + val );
}

function errorHandler ( err, req,res,next) {
  res.send('Error 발생');
}


//에러 파라미터
app.use(function(err,req,res,next) {
  res.status(500).send('에러발생');
});

//에러 처리 미들웨어로 에러 전달
app.use(function(req,res,next) {
  var error = new Error('에러 메시지')
  error.code = 100;
  return next(error);
});
