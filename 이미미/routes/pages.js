const express = require('express');
const User = require('../core/user');
const router = express.Router();
const Board =require('../core/user')

const user = new User();

router.get('/', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.redirect('/home');
        return;
    }
   
    res.render('index', {title:"web"});
    
})//맨 처음 시작 화면

router.get('/home', (req, res, next) => {//로그인 성공시 홈으로 
    let user = req.session.user;

    if(user) {
        res.render('home', {opp:req.session.opp, name:user.fullname});
        return;
    }
    res.redirect('/');
});
//로그인 했을 때

router.get('/board',(req, res,next)=>{//게시판 목록으로 이동
    //let user = req.session.user;
    
    if(user){
        res.render('board',{title:"board"});
        return;

    }
    res.redirect('/board');
});
//게시판으로 이동했을 때 


router.get('/write',(req, res,next)=>{//글쓰기로 이동
    //let user = req.session.user;
    
    if(user){
        res.render('write',{title:"write"});
 
        return;
    }
   res.redirect('/board');
       
});
//글 작성화면


router.post('/login', (req, res, next) => {//로그인이라는 행동을 함 
    
    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
           
            req.session.user = result;
            req.session.opp = 1;
           
            res.redirect('/home');//로그인 성공시 home으로 이동
        }else {
           
            res.send('Username/Password incorrect!');//실패시 나오는 화면
        }
    })

});
//로그인이라는 행동


router.post('/register', (req, res, next) => {//가입
    
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };//입력한 id, pw
  
    user.create(userInput, function(lastId) {//회원가입을 하면

        if(lastId) {
 
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');//찾아서 로그인해서 /home으로 감
            });

        }else {
            console.log('Error creating a new user');
        }
    });

});
//가입하는 행동


router.post('/writing', (req, res, next) => {
    
    let writeInput = {
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        date: req.body.date
    };

    console.log(writeInput);

    user.writing(writeInput, function(insertid) {
        req.body.id = insertid;
        res.redirect('/board');
    });
    
});

router.get('/loggout', (req, res, next) => {
    
    if(req.session.user) {
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});
//loggout했을 때

module.exports = router;