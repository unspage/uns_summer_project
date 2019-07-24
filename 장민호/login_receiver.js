var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// body-parser 사용을 명시
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true});

// express 설정. 폴더, 엔진
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('./'));

app.post('/', function(req, res) {
  var buffer = '';
  req.on('data', function(chunk) {
      buffer += chunk;
  });
  req.on('end', function() {
      var data = query.parse(buffer);
      var id = data.id;
      var pwd = data.pwd;

      console.log('id: ' + id);
      console.log('pwd: ' + pwd);

      // redirect
      res.statusCode = 302;
      res.setHeader('Location', '.');
      res.end('Success');
  })
});