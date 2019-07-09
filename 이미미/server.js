var http=require('http');
var fs=require('fs');
function send404Message(response){
    response.writeHead(404,{"Content-Type":"text/plain"});
    response.write("404 ERROR... ");
    response.end();
}
 
function onRequest(request, response){
 
    if(request.method == 'GET' && request.url == '/'){
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.createReadStream("./login.html").pipe(response);
 
    } else {
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




/*
var server=http.createServer(function(req,res){

    
    res.write('<html><body><h1>LOGIN</h1></body></html>');
    res.end();
}).listen(3000);*/