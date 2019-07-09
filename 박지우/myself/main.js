var http = require('http');
var url = require('url');
var qs = require('querystring');
var usrid = '201713842';
var pwd = '1234';
//var inputid;
//var inputpwd;
var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'eraser',
  database : 'login'
});
conn.connect();

function templateHTML(title, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
    <h1> ${title}</h1><br>
      ${body}
    </body>
    </html>
    `;
  }
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if((pathname ==='/')&&(queryData.id===undefined)){
        var title = 'LOGIN';
        var content = `<form action="http://localhost:3000?id=check" method="post">
                        id : <input type="text" name="id"><br>
                        pwd : <input type="text" name="pwd"><br>
                        <input type="submit">
                        </form>`;
        var template = templateHTML(title,content);
        response.writeHead(200);
        response.end(template);
    }
    else{
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            inputid = post.id;
            inputpwd = post.pwd;
            console.log("->",inputid);
            conn.query(`select * from login where id like '${inputid}' and pwd like '${inputpwd}'`, function(error,data,inputid,inputpwd){
              if(error){
                throw error;
              }
              if(data.length==0){
                var template = `<h1>fail</h1>`;
                response.writeHead(200);
                response.end(template);
              }
              var template = `<h1>success</h1>`;
              response.writeHead(200);
              response.end(template);
            });
            /*if(inputid === usrid){
              var title = "SUCCESS";
              var content='<h1>success</h1>';
              response.writeHead(200);
              response.end(templateHTML(title, content));
          }

          else{
              //var title = 'FAIL';
              //var content = `<h1>fail<h1>`;
              //var template = templateHTML(title,content);
              //response.writeHead(200);
              //response.end(template);
              var title = 'LOGIN';
        var content = `<form action="http://localhost:3000?id=check" method="post">
                        id : <input type="text" name="id">
                        pwd : <input type="text" name="pwd">
                        <input type="submit">
                        </form>`;
        var template = templateHTML(title,content);
        response.writeHead(200);
        response.end(template);
          }*/
        });
    }
    
});
app.listen(3000);