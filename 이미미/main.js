var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql'); 
var qs = require('querystring');

var db = mysql.createConnection({ 
  host     : 'localhost',
  //port:3000,
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
                 <td><input type="text" name="ID"></td>
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
        request.on('data', function(data){
           
          body = body + data;
        });
        request.on('end',function(){
            var post=qs.parse(body);
            var id2=post.id;//입력한 id
            var pw2=post.pw;//입력한 pw
            db.query(`select * from web.customer where id like '${post.id}' and pw like '${post.pw}'`,function(error, data,id2,pw2){
                if(error){
                    throw error;
                }
                if(data.length==0)//select의 개수가0이면 로그인성공
                {
                response.writeHead(200);
                response.end('login_fail');//로그인 실패
                
            }
                else{
                    response.writeHead(200);
                    response.end('login_success');//로그인 성공
                }
            })

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
                 <td><input type="text" name="ID"></td>
               </tr>
               <tr>
                 <td>PASSWORD : </td>
                 <td><input type="password" name="pw"></td>
               </tr>
               <tr>
                 <td>PASSWORD확인 : </td>
                 <td><input type="password" name="pw확인"></td>
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
    else if(pathname==='/join_success_fail'){//가입 성공 실패
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end',function(){
            var post=qs.parse(body);
            var new_id=post.id;//입력한 id
            var new_pw=post.pw;//입력한 pw
            var new_pw2=post.pw_chk;//입력한 pw확인
            var new_user_name=post.user_name;
            var new_email=post.email;
            db.query(`insert into web.customer values ('${post.id}', '${post.pw}','${post.user_name}', '${post.email}')`,[post.id],[post.pw],[post.user_name],[post.email],function(error, topics){
                if(error){
                    throw error;
                }
                if(new_pw==new_pw2){//중복아이디 아직 처리안함
                    response.writeHead(200);
                    response.end('join_success');
                }//회원가입 실패
                else{
                    response.writeHead(200);
                    response.end('join_success');
                    console.log(new_id);
            }
            })

        });
        
    }

    else if(pathname==='/board'){//글목록
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
          for(var i=0;i<rows.length;i++){
            var oneItem=rows[i];
          %>
            <tr>
            <td><%=oneItem.idx%></td>
            <td><%=oneItem.id%></td>
            <td><%=oneItem.title%></td>
            <td><%=oneItem.views%></td>
            <td><%=oneItem.date%></td>
            <td><input type="submit" value="delete"></td>
            </tr>
          <%
          }
          %>
          </table>
         
       </body>
       </html>`;
      
      response.writeHead(200);
      response.end(tem1);
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
app.listen(3000);