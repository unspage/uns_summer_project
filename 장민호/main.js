var http = require('http');
var fs = require('fs');

var app = http.createServer(function(request,response){
    var request_url = request.url;
    if(request_url == '/'){
      request_url = '/index.html';
    }
    if(request_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + request_url));
 
});
app.listen(3000);