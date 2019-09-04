const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();
var helmet=require('helmet');
//app.use안에 있는 모든 함수들은 다 미들웨어, 요청 올때마다 미들웨어 거치면서 client에게 응답
app.use(express.urlencoded( { extended : false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));//pug가 들어 있는 폴더를 정함
app.set('view engine', 'pug');//엔진을 pug로 설정
app.use(helmet());

app.use(session({
    name:'sessionID',
    secret:'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

app.disable('x-powered-by');
app.use('/', pageRouter);

app.use('/upload', express.static('uploads'));

app.use((req, res, next) =>  {//404에러처리 핸들러
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})


app.use((err, req, res, next) => {//404제외한 다른 에러처리 핸들러
    res.status(err.status || 500);
    res.send(err.message);
});


app.listen(3000, () => {
    console.log('port: 3000');
});

module.exports = app;