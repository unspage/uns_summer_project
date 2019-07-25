const pool = require('./pool');
const bcrypt = require('bcrypt');//password저장목적


function User() {};

User.prototype = {
   
    list : function(users=null, callback)
    {
        let sql='SELECT num, id, title, views FROM board';

        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
        });
        

    },


    find : function(user = null, callback)
    {
        
        if(user) {
            
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
       
        let sql = `SELECT * FROM users WHERE ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
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

    infowriting : function(body, callback)  //가계부기록
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