var http=require('http');
var fs=require('fs');
function send404Message(response){
    response.writeHead(404,{"Content-Type":"text/plain"});
    response.write("404 ERROR... ");
    response.end();
}
 
function onRequest(request, response){
 //request.method == 'GET' && 
    if(request.url == '/'){
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.createReadStream("./login.html").pipe(response);
 
    } else if(request.url == '/login2.html'){
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.createReadStream("./login2.html").pipe(response);
 
    }
    else
    {
        send404Message(response);
 
    }
 
}
http.createServer(onRequest).listen(3000);
console.log("Server Created...");

function send404Message(response){
    response.writeHead(404,{"Content-Type":"text/plain"}); 
    response.write("404 ERROR... ");
    response.end();
}
