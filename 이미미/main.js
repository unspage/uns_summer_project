var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql'); 
var qs = require('querystring');
var express=require('express');
var ejs=require('ejs');


var db = mysql.createConnection({ 
  host     : 'localhost',
  port:3306,
  user     : 'root',
  password : '3819',
  database : 'web'
 }); 
   
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var id=queryData.id;
  var pw=queryData.pw;

    if(pathname === '/'){//시작페이지
         var template = `<!DOCTYPE html>
         <html lang="en">
         <head>
           <meta charset="UTF-8">
           <title>시작페이지</title>
         </head>
         <body>
           <h1>LOGIN</h1>
           <form action="http://localhost:3000/login" method="post">
             <table>
               <tr>
                 <td>ID : </td>
                 <td><input type="text" name="id"></td>
               </tr>
               <tr>
                 <td>PASSWORD : </td>
                 <td><input type="password" name="pw"></td>
               </tr>
               <tr>
                 <td><input type="submit" value="로그인"></td>
               </tr>
            </table>
           </form>
         
           <form action="http://localhost:3000/find" method="post">
             <table>
               <tr>
                 <td><input type="submit" value="아이디/비밀번호찾기"></td>
               </tr>
             </table>
             </form>
           <form action="http://localhost:3000/join" method="post">
             <table>
               <tr>
                 <td><input type="submit" value="회원가입"></td>
               </tr>
             </table>
             </form>
             <form action="http://localhost:3000/board" method="post">
             <table>
               <tr>
                 <td><input type="submit" value="게시판 이동"></td>
               </tr>
             </table>
             </form>

         </body>
         </html>`;
          response.writeHead(200);
          response.end(template);
        
    }
    else if(pathname === '/login'){//로그인했을때 결과
        var body = '';
        var dataid='';
        var datapw='';
        var n=0;
        request.on('data', function(data){
          body = body + data;
        });

        request.on('end',function(){
            var post=qs.parse(body);
            var dataid=post.id;//입력한 id
            var datapw=post.pw;//입력한 pw
        
         // db.query(`select * from customerwhere id like '${dataid}' and pw like '${datapw}'`,function(error, result,fields ){

            db.query(`SELECT * FROM customer`, function (error, result, fields) {
              if (error) {
                  console.log(error);
              }
              for(var i=0;i<result.length;i++){
                if(result[i].id==dataid && result[i].pw==datapw ){
                  var n=1;          
                }
              }

              if(n==1){
                response.writeHead(200);
                response.end('login_success');
              }
              else{
                response.writeHead(200);
                response.end('login_fail');
              }

              
            });
        });
          
      
      }
    else if(pathname==='/join'){//가입페이지
        var tem=`
        <!DOCTYPE html>
         <html lang="en">
         <head>
           <meta charset="UTF-8">
           <title>회원가입</title>
         </head>
         <body>
           <h1>join</h1>
           <form action="http://localhost:3000/join_success_fail" method="post">
             <table>
               <tr>
                 <td>ID : </td>
                 <td><input type="text" name="id"></td>
               </tr>
               <tr>
                 <td>PASSWORD : </td>
                 <td><input type="password" name="pw"></td>
               </tr>
               <tr>
                 <td>PASSWORD확인 : </td>
                 <td><input type="password" name="pw_chk"></td>
               </tr>
               <tr>
                 <td>이름: </td>
                 <td><input type="text" name="user_name"></td>
               </tr>
               <tr>
                 <td>이메일 : </td>
                 <td><input type="text" name="email"></td>
               </tr>

               <tr>
                 <td><input type="submit" value="가입"></td>
               </tr>
            </table>
           </form>
         </body>
         </html>`;
        
        response.writeHead(200);
        response.end(tem);
    }


    else if(pathname==='/join_success_fail'){//가입 결과
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end',function(){
            var post=qs.parse(body);
            var new_id=post.id;//입력한 id
            var new_pw=post.pw;//입력한 pw
            var new_pw_chk=post.pw_chk;//입력한 pw확인
            var new_user_name=post.user_name;
            var new_email=post.email;
      
           if(new_pw==new_pw_chk){
            db.query(`INSERT INTO customer(id, pw, email,user_name) VALUES ('${new_id}', '${new_pw}','${new_email}', '${new_user_name}')`,function(error, result,fields){
                response.writeHead(200);
                response.end('join_success');
            });  
          }
          else{
            response.writeHead(200);
            response.end('join_fail');

          }

          });
    
      }//끝

    else if(pathname==='/board'){//글목록
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end',function(){
        var post=qs.parse(body);
        db.query('SELECT *  FROM list', function (error, result, fields){
           for(var i=0;i<result.length;i++){
            console.log(result[i].idx, result[i].id,result[i].title,result[i].views,result[i].date)
          }
          /*
          var idx=result[i].idx;
          var id=result[i].id;
          var title=result[i].title;
          var view=result[i].views;
          var date=result[i].date;
          var tem1=`
        <!DOCTYPE html>
         <html lang="en">
         <head>
           <title>board</title>
         </head>
         <body>
           <h1>board</h1>
           <a href="http://localhost:3000/board/write">board write</a>
           <br>
           <br>
             <table border="1">
               <tr>
                 <td>idx </td>
                 <td>id </td>
                 <td>title </td>
                 <td>views </td>
                 <td>date </td>
                 <td>delete</td>
      
               </tr>
            <%
            for(var i=0;i<result.length;i++){
              var result=result[i];
            %>
              <tr>
              <td>'${idx}'</td>
              <td>'${id}'</td>
              <td>'${title}'</td>
              <td>'${view}'</td>
              <td>'${date}'</td>
              <td><input type="submit" value="delete"></td>
              </tr>
            <%
            }
            %>
            </table>
           
         </body>
         </html>`;

          response.writeHead(200);
          response.end(tem1);*/
          response.writeHead(200);
          response.end(result);
        });  
       

   
    
      }); 
  }


  else if(pathname=='/board/write'){//글쓰기
    var tem2=`
    <!DOCTYPE html>
    <html>
  <head>
 
  <title>write</title>
  </head>
  <body>
  <h1><=%title%></h1>

  <form action="/board/write" method="post">
  <table border="1">
      <tr>
          <td>creator_id</td>
          <td><input type="text" name="creator_id" id="creator_id" required/></td>
      </tr>
      <tr>
          <td>title</td>
          <td><input type="text" name="title" id="title" required/></td>
      </tr>
      <tr>
          <td>content</td>
          <td><textarea name="content" id="content" cols="30" rows="10" required></textarea></td>
      </tr>
      <tr>
          <td>pw</td>
          <td><input type="password" name="passwd" id="passwd" required/></td>
      </tr>
      <tr>
          <td colspan="2">
              <button type="submit">check</button>
          </td>
      </tr>
  </table>
</form>
</body>
</html>`;
response.writeHead(200);
response.end(tem2);
/*
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end',function(){
        var post=qs.parse(body);
        var creator_id=post.id;
        var title=post.title;
        var content=post.content;
        var datas=[creator_id, title,content,pw];
       db.query(`insert into web.board values ('${post.id}', '${post.title}','${post.content}')`,function(error, topics)
        {
            if(error){
                throw error;
            }
            else{
                response.writeHead(200);
                response.end('board_success');
        }
        })

    });*/
    
  }


     else {
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
  
//db.end();
app.listen(3000);