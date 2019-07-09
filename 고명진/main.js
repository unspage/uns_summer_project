var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var id = queryData.id;
    var pw = queryData.pw;


    if(pathname === '/'){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 -</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
          <form action = "http://localhost:3000/create_process" method = "post">
            <p><input type="text" name="id" value="" placeholder = "intput ID"></p>
            <p><input type="text" name="pw" value="" placeholder = "intput PW"></p>
            <p>
              <input type ="submit">
            </p>
          </form>
          </ul>
          <h2></h2>
          <p></p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    }
    else if (pathname === '/create_process') {

      var body = '';
      request.on('data',function(data) {
        body = body + data;
      });
      request.on('end',function() { //데이터의 끝
        var post = qs.parse(body);
        if (post.id === '123' && post.pw ==='456'){
          response.writeHead(200);
          response.end('success');
        }
        else {
          response.writeHead(200);
          response.end('fail');
        }
      });

    }

    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
