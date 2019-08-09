const express = require('express');
const User = require('../core/user');
const router = express.Router();
const Board =require('../core/user');
var multer = require('multer')
var upload = multer({ dest: "uploads/"});
var fs=require('fs');

//var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage })
const user = new User();

router.get('/', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.redirect('/home');
        return;
    }
   
    res.render('index', {title:"web"});
    
})//맨 처음 시작 화면

router.post('/upload', upload.single('userfile'), function(req, res){

    let photoinput={
        user : req.session.user.id,    
        path : req.file.path,
        filename : req.file.filename,
        title :req.body.title,
    }
    console.log(photoinput);

   user.PHOTO(photoinput, function(result){
    req.session.user = result;
    res.redirect('/upload');

   })
  });

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
  
    user.list(user, function(result){
    //req.session.user = result;

    res.render('board', { title: "board_list", boards: result});
    })

});


router.get('/info',(req, res,next)=>{//가계부로 이동
    //let user = req.session.user;
 
        res.render('info',{title:"가계부"});
  
});

router.get('/upload',(req, res,next)=>{//photo목록
  
    user.p_list(user, function(result){
            res.render('upload', { title: "upload", photos: result});

    })
});

router.get('/board/:num' ,(req, res,next)=>{//글 하나하나 읽기

    let num=req.params.num;
    console.log(num);
   user.read(num, function(result){
        res.render('board_read', { title: "board_read", boards: result});
    })
    

});

    
router.get('/write',(req, res,next)=>{//게시판 글쓰기로 이동
    //let user = req.session.user;
    
    if(user){
        res.render('write',{title:"write"});
 
        return;
    }
   res.redirect('/board');
       
});

router.get('/board/edit/:num',(req, res,next)=>{//게시판 글수정
    //let user = req.session.user;
    
    if(user){
        res.render('edit-write',{title:"edit-write"});
 
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

router.get('/expense',(req, res,next)=>{//로그인 되어있는 회원의 지출내역
    let userinfo = req.session.user;
    
    user.mylist(userinfo, function(result){
        if(result){
        res.render('expense', { title: "expense_list", infos: result});
    }


        })

});

router.get('/import',(req, res,next)=>{//로그인 되어있는 회원의 수입내역
    let userinfo = req.session.user;

    user.plusmylist(userinfo, function(result){
        if(result){
        res.render('import', { title: "import_list", plusinfos: result});
    }
        })

});
/*
router.get('/read',(req, res,next)=>{//게시판 글 보여주기
    if(user){
        res.render('board_edit',{title:"정보수정"});
 
        return;
    }
   res.redirect('/home');
       
});
*/
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

router.post('/edit-writing/:num', (req, res, next) => {//미완:글 수정
    
    
    let editwriteInput = {
        num:req.body.number,
        title: req.body.title,
        content: req.body.content,
        id: req.session.user.id
   
        //number: req.body.number
    };
    //console.log(num);
    console.log(editwriteInput);
    user.edit_writing(editwriteInput, function(insertid) {
        req.body.id = insertid;
        res.redirect('/board');
    });
    
});

router.post('/board/delete/:num', (req, res, next) => {
    //let num=req.params.num;
    //let id= req.session.user.id;
    let board_delete = {
        num : req.params.num,
        id : req.session.user.id
    };
     console.log(board_delete);
     //console.log(id);
    //console.log(deleteInput);
     user.board_delete(board_delete,function(insertid) {
         req.body.id = insertid;
         res.redirect('/board');
     });
     
 });

 router.post('/upload/delete/:p_title', (req, res, next) => {
    //let p_title=req.params.p_title;
    //let id= req.session.user.id;

    let upload_delete = {
        
        p_title:req.params.p_title,
        id:req.session.user.id
    };
     console.log(upload_delete);
     //console.log(id);
    //console.log(deleteInput);
    
     user.photo_delete(upload_delete,function(insertid) {
         req.body.id = insertid;
         res.redirect('/upload');
     });
     
 });

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