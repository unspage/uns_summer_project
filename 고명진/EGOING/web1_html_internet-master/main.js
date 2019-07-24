var http = require('http');
var fs = require('fs'); //파일 읽기
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData);
    if(url == '/'){
      url = '/index.html';
    }
    if(url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`,'utf8',function(err,data) {
      var description = data;
      var template = `
      <!doctype html>r
      <html>
      <head>
        <title>WEB1 - HTML</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="index.html">WEB</a></h1>
        <ol>
          <li><a href="1.html">HTML</a></li>
          <li><a href="2.html">CSS</a></li>
          <li><a href="3.html">JavaScript</a></li>
        </ol>
        <h2>HTML</h2>
        <p>
        ${description}
        </p>
      </body>
      </html>

      `;
      response.end(template);
    });


});
app.listen(3000);
