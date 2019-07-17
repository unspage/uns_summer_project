var express = require('express'); // 웹 서버 사용
var fs = require('fs') // 파일 로드 사용
 
var app = express();
var port = 3000;
 
app.listen(port, function(){
    console.log('Server Start, Port : ' + port);
});//express 서버 생성
 
app.get('/', function(req, res){//router로 request처리
    fs.readFile('login.html', function(error, data){
        if(error){
            console.log(error);
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});
