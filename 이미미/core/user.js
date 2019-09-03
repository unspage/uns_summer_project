const pool = require('./pool');
const bcrypt = require('bcrypt');//password저장목적


function User() {};

User.prototype = {
   
    find : function(user = null, callback)
    {
        
        if(user) {
            
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        
        pool.query(sql, user, function(err, result) {
            //console.log(result.id, result.fullname);
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
        });
    },


    list : function(user= null, callback) //게시판 목록
    {       
        let sql = `SELECT b.num, u.username, b.title, b.views, b.date FROM board AS b JOIN USERS AS u ON b.id=u.id ORDER BY b.date DESC`;//게시판 목록 가져옴
        
        pool.query(sql, user, function(err, result) {
            //console.log(result.num);
            console.log(result.length);
            console.log(result[0]);
            if(err) throw err;

            if(result.length) {
                callback(result);
            }
            else {
                callback(null);
            }
        });
    },



    p_list : function(user, callback) //사진 목록
    {       
        let sql = `SELECT u.username, p.path, p.p_title, p.title FROM photo AS p JOIN USERS AS u ON u.id=p.id ORDER BY p.num DESC`;//게시판 목록 가져옴

        pool.query(sql, user, function(err, result) {
 
            if(err) throw err;
            
           //if(result.length) {
                callback(result);
            //}
            //else {
               // callback(null);
           // }/
        });
    },
    
    

    read : function(num, callback) //게시판 하나하나읽기
    {   
        console.log(num);
        let sql = `SELECT u.username, b.title, b.content, b.views, b.date FROM board AS b JOIN USERS AS u ON b.id=u.id WHERE b.num=${num}`;
    
        pool.query(sql, num, function(err, result) {
            if(err) throw err;

            if(result.length) {
                callback(result);
            }
            else {
                callback(null);
            }
        });
    },


    mylist : function(userinfo, callback) //지출게시판 목록
    {   

        console.log(userinfo.id);
        let sql = `SELECT num, expense, price, category, date, type FROM info AS i JOIN USERS AS u ON i.id=u.id WHERE i.id= ${userinfo.id} order by date desc`;//게시판 목록 가져옴
        
        pool.query(sql, userinfo, function(err, result) {

            if(err) throw err;

                callback(result);

        });
    },

    usersum : function(id, callback) //총액
    {   

        console.log(id);
        let sql = `SELECT sum(price) as one, sum(p_price) as two FROM info as i JOIN plusinfo AS PI on i.id=pi.id WHERE i.id=${id}`;
        
        pool.query(sql, id, function(err, result) {

            if(err) throw err;

                callback(result);

        });
    },

    plusmylist : function(userinfo, callback) //수입게시판 목록
    {   

        console.log(userinfo.id);
        let sql = `SELECT num, p_expense, p_price, category, date, type FROM plusinfo AS p JOIN USERS AS u ON p.id=u.id WHERE p.id= ${userinfo.id} order by date desc`;//게시판 목록 가져옴
        
        pool.query(sql, userinfo, function(err, result) {

            if(err) throw err;
            callback(result);
        });
    },

    chart_select : function(chart_select, callback) //차트
    {   

        console.log(chart_select.id);
        console.log(chart_select.year);
        console.log(chart_select.month);
        
       let sql = `SELECT category, sum(price) as ss, year(date) as yy, month(date) as bb FROM info WHERE id= ${chart_select.id} and year(date)=${chart_select.year} and month(date)=${chart_select.month} GROUP BY category`;
 
       pool.query(sql, chart_select, function(err, result) {
            console.log(result.length);
            if(err) throw err;
            callback(result);
        });
    },

    create : function(body, callback) //회원가입
    {
        var pwd = body.password;
        body.password = bcrypt.hashSync(pwd,10);//password를 해싱하여 변환된 코드 받을 수 있음

        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = `INSERT INTO users(username, fullname, password) VALUES (?, ?, ?)`;//회원가입
       
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
        
            callback(result.insertId);
        });
    },

    PHOTO : function(body, callback) //사진 추가
    {
        var bind = [];

        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = `INSERT INTO photo(id, path, p_title, title) VALUES (?, ?, ?, ?)`;
       
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
        
            callback(result.insertId);
        });
    },

    photo_delete: function(upload_delete,callback)  //사진삭제
    {
        console.log(upload_delete.p_title);
        console.log(upload_delete.id);
        let sql = "delete from photo where id='"+upload_delete.id+"'and p_title like '"+upload_delete.p_title+"'";
        pool.query(sql, upload_delete, function(err, result) {
            if(err) throw err;
           console.log(result.id); 
            callback(result.id);
        });
    
    },

    writing : function(body, callback)  //글쓰기
    {

        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = 'INSERT INTO board (id, title, content, date) VALUES (?,?,?,?)';
          
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            console.log(result.id); 
            callback(result.id);
        });
    
    },
    edit_writing : function(editwriteInput, callback)  //글수정
    {
        console.log(editwriteInput);
        console.log(editwriteInput.title);
        console.log(editwriteInput.content);
        console.log(editwriteInput.id);
        console.log(editwriteInput.num);
        let sql = "UPDATE board SET title='"+editwriteInput.title+"', content='"+editwriteInput.content+"' where id='"+editwriteInput.id+"' and num='"+editwriteInput.num+"'";
        pool.query(sql, editwriteInput, function(err, result) {
            if(err) throw err;

            callback(result.id);
        });
    
    },
    infowriting : function(body, callback)  //가계부지출내역기록
    {

        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = 'INSERT INTO info (id, expense, price, category, date, type) VALUES (?,?,?,?,?,?)';
          
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            console.log(result.id); 
            callback(result.id);
        });
    
    },

    plusinfowriting : function(body, callback)  //가계부지출내역기록
    {

        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = 'INSERT INTO plusinfo (id, p_expense, p_price, category, date, type) VALUES (?,?,?,?,?,?)';
          
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            console.log(result.id); 
            callback(result.id);
        });
    
    },

    userupdate : function(body, callback)  //회원 정보 수정
    {
        
        var inputusername=body.username;
        body.username=inputusername
        var inputfullname=body.fullname;
        body.fullname=inputfullname;
        var pwd = body.password;
        body.password = bcrypt.hashSync(pwd,10);
        var inputid=body.id;
        body.id=inputid;
        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        console.log(bind);
    
        let sql = "UPDATE users SET username='"+body.username+"', fullname='"+body.fullname+"',password='"+body.password+"' where id='"+body.id+"'";  
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            console.log(result.id); 
            callback(result.id);
        });
    
    },

    withdrawal : function(body, callback)  //회원탈퇴
    {
        

        var inputid=body.id;
        body.id=inputid;
        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        console.log(bind);
    
        let sql = "delete from users where id=?";  
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            console.log(result.id); 
            callback(result.id);
        });
    
    },
    board_delete: function(board_delete,callback)  //게시판 삭제
    {
        console.log(board_delete.num);
        console.log(board_delete.id);
        let sql = "delete from board where num='"+board_delete.num+"' and id='"+ board_delete.id+"'";
        pool.query(sql, board_delete, function(err, result) {
            if(err) throw err;
           console.log(result.id); 
            callback(result.id);
        });
    
    },

    expense_delete: function(expense_delete,callback)  //지출내역삭제
    {
        console.log(expense_delete.num);
        console.log(expense_delete.id);
        let sql = "delete from info where num='"+expense_delete.num+"' and id='"+ expense_delete.id+"'";
        pool.query(sql, expense_delete, function(err, result) {
            if(err) throw err;
           console.log(result.id); 
            callback(result.id);
        });
    
    },

    import_delete: function(import_delete,callback)  //수입내역삭제
    {
        console.log(import_delete.num);
        console.log(import_delete.id);
        let sql = "delete from info where num='"+import_delete.num+"' and id='"+ import_delete.id+"'";
        pool.query(sql, import_delete, function(err, result) {
            if(err) throw err;
           console.log(result.id); 
            callback(result.id);
        });
    
    },


    login : function(username, password, callback)//로그인
    {
       
        this.find(username, function(user) {
         
            if(user) {
                
                if(bcrypt.compareSync(password, user.password)) {//입력된 password와 해싱된 코드 user.password를 비교
                    callback(user);
                    return;
                }  
            }
            callback(null);
        });
        
    }

}

module.exports = User;