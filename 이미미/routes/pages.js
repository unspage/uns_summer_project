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

router.get('/home', (req, res, next) => {
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

router.get('/info',(req, res,next)=>{//가계부로 이동
    //let user = req.session.user;
    
    if(user){
        res.render('info',{title:"가계부"});
        return;

    }
    res.redirect('/info');
});

router.get('/write',(req, res,next)=>{//게시판 글쓰기로 이동
    //let user = req.session.user;
    
    if(user){
        res.render('write',{title:"write"});
 
        return;
    }
   res.redirect('/board');
       
});
//글 작성화면
router.get('/infowrite',(req, res,next)=>{//가계부 작성으로이동
    //let user = req.session.user;
    
    if(user){
        res.render('infowrite',{title:"가계부작성"});
 
        return;
    }
   res.redirect('/info');
       
});

router.get('/mypage',(req, res,next)=>{//회원정보수정
    if(user){
        res.render('mypage',{title:"정보수정"});
 
        return;
    }
   res.redirect('/home');
       
});


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


router.post('/register', (req, res, next) => {//회원가입
    
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };//입력한 id, pw
    console.log(userInput);
    user.create(userInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });
        }else {
            console.log('Error creating a new user');
        }
    });

});
//가입하는 행동

router.post('/writing', (req, res, next) => {
    let writeInput = {
        id: req.session.user.id,
        title: req.body.title,
        content: req.body.content,
        date: req.body.date
    };

    console.log(writeInput);
    user.writing(writeInput, function(insertid) {
        req.body.id = insertid;
        res.redirect('/board');
    });
    
});//게시판 글 작성하는 행동

router.post('/mypaging', (req, res, next) => {//회원정보수정
    
    let userchaning = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password,
        id:req.session.user.id
    };//입력한 id, pw
  
    console.log(userchaning);

    user.userupdate(userchaning, function(insertid) {
        req.body.id = insertid;
        res.redirect('/home');
    });

});//회원 정보수업하는 행동

router.post('/infowriting', (req, res, next) => {//가계부지출내역작성
    
    let infowriting = {
        id:req.session.user.id,
        expense: req.body.expense,
        price: req.body.price,
        category: req.body.category,
        date: req.body.date,
        type: req.body.type
        
    };//입력한 내용
  
    console.log(infowriting);

    user.infowriting(infowriting, function(insertid) {
        req.body.id = insertid;
        res.redirect('/info');
    });

});

router.post('/plusinfowriting', (req, res, next) => {//가계부수입내역작성
    
    let plusinfowriting = {
        id:req.session.user.id,
        p_expense: req.body.p_expense,
        p_price: req.body.p_price,
        category: req.body.category,
        date: req.body.date,
        type: req.body.type
        
    };//입력한 내용
  
    console.log(plusinfowriting);

    user.plusinfowriting(plusinfowriting, function(insertid) {
        req.body.id = insertid;
        res.redirect('/info');
    });

});

router.post('/withdrawal', (req, res, next) => {//회원탈퇴
    
    let withdrawal = {
        id:req.session.user.id
    };//입력한 id, pw
  
    console.log(withdrawal);

    user.withdrawal(withdrawal, function(insertid) {
        req.body.id = insertid;
        req.session.destroy(function() {
            res.redirect('/');
        });
    });

});

router.get('/logout', (req, res, next) => {//logout
    if(req.session.user) {
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});


module.exports = router;