var http = require('http');
var ejs = require('ejs');
var fs = require('fs');

var users = [
  {id: 10, user_id: 'example10', user_pwd: '1010'},
  {id: 11, user_id: 'example11', user_pwd: '1111'}
];

var app = http.createServer(function(req, res) {
  fs.readFile('board.ejs', 'utf-8', function(err, data) {
    res.writeHead(200, {'Content-Type' : 'text/html'});

    res.end(ejs.render(data));
  });
}).listen(3000, function() {
  console.log('server running at http://localhost:3000');
});