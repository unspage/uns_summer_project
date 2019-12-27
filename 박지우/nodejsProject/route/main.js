var express = require('express')
var router = express()
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var cheerio = require('cheerio')
var request = require('request')
var {PythonShell} = require('python-shell')
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');


router.use(cookieParser());
router.use(session({
  key: 'sid', //세션의 키값
  secret: 'secret', //세션의 비밀 키,  쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
  resave: false, //세션을 항상 저장할지 결정
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}))
var movielist=[];
var list_cgv = ['강남','강변','건대입구','구로','대학로','동대문','등촌','명동','명동역 씨네라이브러리','목동','미아','불광','상봉','성신여대입구','송파'
,'수유','신촌아트레온','압구정','여의도','영등포','왕십리','용산아이파크몰','중계','천호','청담씨네시티','피카디리1958','하계','홍대']
var list_mega = ['강남','강남대로(씨티)','강동','군자','동대문','마곡','목동','상봉','상암월드컵경기장','센트럴','송파파크하비오'
,'신촌','은평','이수','창동','코엑스','화곡','ARTNINE']
var theater =['','',''];
var loc=['','',''];

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'eraser',
    database: 'login'
  });
conn.connect();
  
router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({extended:false}))

// getLocation = function(){
//     window.navigator.geolocation.getCurrentPosition (function(pos) {
//         // $('#latitude').html(pos.coords.latitude);     // 위도
//         // $('#longitude').html(pos.coords.longitude); // 경도
//         console.log(pos.coords.latitude);
//     });
// }
// getLocation();
request.get({url:'http://www.cgv.co.kr/movies/'},function(err,res,body){
    var $ = cheerio.load(body);
    var titlelist = $('#contents').children('.wrap-movie-chart').children('.sect-movie-chart').find('ol').find('li');
    titlelist.each(function(i, elem) {
        movielist.push($(this).children('.box-contents').find('a').find('strong').text());
    });
});
var options= {
    mode : 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: []
};
PythonShell.run('crawling_test_3.py', options, function(err, result){
    if(err)
        console.log(err)
    info3 = JSON.parse(result);
    for(i=1;i<4;i++){
        var li = info3[i].split(' ');
        if (theater.indexOf(li[0])!=-1)
            continue;
        if (li[0]=='CGV'){
            theater[0] = li[0];
            loc[0] = li[1]; 
            continue;
        }
        else if(li[0]=='메가박스'){
            theater[1] = li[0];
            loc[1] = li[1]; 
            continue;
        }
        else if(li[0]=='롯데시네마'){
            theater[2] = li[0];
            loc[2] = li[1]; 
            continue;
        }
        // theater.push(li[0]);
        // loc.push(li[1]);
    }
    console.log(theater, loc)
    console.log("1:주변영화관데이터크롤링완료")
});

var info4 = {"time":[],"seat":[]};
var info5 = {"time":[],"seat":[]};
var info6 = {"time":[],"seat":[]};
console.log("2:클라이언트통신준비완료")
router.get('/',function(req,res){
        fs.readFile('./public/index2.html', 'utf-8', function (error, data) {
            res.send(ejs.render(
                data,
                {session:req.session,movielist:movielist,theater:theater,loc:loc}
            ))
        })
        console.log("3:메인화면띄우기완료")
})
router.get("/login", function(req,res){
    var body = req.body;
    fs.readFile('./public/login.html','utf-8',function(error, data){
        res.send(ejs.render(
            data,
            {session:req.session}
        ))
    })
})
router.post("/login", function(req,res){
    var body = req.body;
    var userid = body.id;
    var userpw = body.pwd;

    var shasum = crypto.createHash('sha1');
    shasum.update(userpw);
    userpw = shasum.digest('base64');;
    console.log(userpw)


    conn.query(`select * from login where id like ?`, [userid], function(error, data){
        if(data.length==0){
            fs.readFile('./public/login.html','utf-8',function(error, data2){
                res.send(ejs.render(
                    data2,
                    {session:req.sessionk,error:"없는 계정입니다"}
                ))
            })
        }
        if(data[0].pwd == userpw){
            console.log("성공")
            req.session.userid = userid;
            res.redirect('/');
        }
        else{
            fs.readFile('./public/login.html','utf-8',function(error, data2){
                res.send(ejs.render(
                    data2,
                    {session:req.session,error:"없는 계정입니다"}
                ))
            })
        }
    })
    // conn.query(`select * from login where id like '${userid}' and pwd like '${userpw}'`, function (error, data) {
//   conn.query(`select * from login where id like ? and pwd like ?`, [userid, userpw],function (error, data) {
//     if (error) {
//       throw error;
//     }
//     if (data.length == 0) {
//         fs.readFile('./public/login.html','utf-8',function(error, data2){
//             res.send(ejs.render(
//                 data2,
//                 {session:req.session}
//             ))
//         })
//     }
//     else{
//         req.session.userid = userid;
//         res.redirect('/');
//     }
// })
})
router.get('/logout', function(req,res){
    req.session.destroy(function(){req.session;});
    res.redirect('/');
})
router.get('/signup',function(req,res){
    fs.readFile('./public/signup.html','utf-8',function(error, data){
        res.send(ejs.render(
            data,
            {session:req.session}
        ))
    })
})
router.post('/signup',function(req,res){
    var body = req.body;
    var id=body.id;//입력한 id
    var pw=body.pw;//입력한 pw
    var chk=body.pw_chk;//입력한 pw확인
    var username=body.user_name;
    var email=body.email;
    var check =/^[a-zA-Z0-9]{8,15}$/;
    var checkNumber = pw.search(/[0-9]/g);

    var checkEnglish = pw.search(/[a-z]/ig);

    if(pw==chk){
        conn.query(`SELECT * FROM login WHERE id like ?`,[id],function(error, result,fields){
            if(result.length > 0){
                fs.readFile('./public/signup.html','utf-8',function(error, data){
                    res.send(ejs.render(
                        data,
                        {session:req.session,error:"사용불가한 아이디입니다",email:email,user_name:username}
                    ))
                })
            }
            else{
                if(!check.test(pw)){
                    fs.readFile('./public/signup.html','utf-8',function(error, data){
                        res.send(ejs.render(
                            data,
                            {session:req.session,error:"비밀번호는 숫자와 영문자 조합으로 8~15자리를 사용해야합니다",email:email,user_name:username}
                        ))
                    })
                }
                else if(checkNumber <0 || checkEnglish <0){
                    fs.readFile('./public/signup.html','utf-8',function(error, data){
                        res.send(ejs.render(
                            data,
                            {session:req.session,error:"숫자와 영문자를 각각 1회이상 사용해야합니다",email:email,user_name:username}
                        ))
                    })
                }
                else{
                    var shasum = crypto.createHash('sha1');
                    shasum.update(pw);
                    pw = shasum.digest('base64');
                    console.log(id, pw, email, username)
                    conn.query(`INSERT INTO login(id, pwd, email,name) VALUES (?,?,?,?)`,[id,pw,email, username],function(error, result,fields){
                        req.session.userid = id;
                        res.redirect('/');
                    })
                }
            }
        })
    }
    else{
        fs.readFile('./public/signup.html','utf-8',function(error, data){
            res.send(ejs.render(
                data,
                {session:req.session,error:"비밀번호가 일치하지 않습니다"}
            ))
        })
      }

})
router.post('/view',function(req,res){
    var body = req.body;
    var movie = body.movie;
    fs.readFile('./public/index2.html','utf-8',function(error, data) {
        if(theater[0]!=''){
            var options1= {
                mode : 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: '',
                args: [loc[0],movie]
            };
            PythonShell.run('crawling_test_cgv.py', options1,function(err, res1){
                if (err)
                    throw err;
                info4 = JSON.parse(res1);
                console.log("cgv==>",info4.time);
            })
        }
        if(theater[1]!=''){
            var options2= {
                mode : 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: '',
                args: [loc[1],movie]
            };
            PythonShell.run('crawling_test_mega.py', options2,function(err, res2){
                info5 = JSON.parse(res2);
                console.log("mega==>",info5.time);
            })
        }
        if(theater[2]!=''){
            var options3= {
                mode : 'text',
                pythonPath: '',
                pythonOptions: ['-u'],
                scriptPath: '',
                args: [loc[2],movie]
            };
            PythonShell.run('crawling_test_lotte.py', options3,function(err, res3){
                info6 = JSON.parse(res3);
                console.log("lotte==>",info6.time);
                res.send(ejs.render(
                    data,
                    {session:req.session,result:"true",movielist:movielist,time_lotte:info6.time,seat_lotte:info6.seat,time_cgv:info4.time,seat_cgv:info4.seat,time_mega:info5.time,seat_mega:info5.seat,theater:theater,loc:loc}
                ))
            })
        }
        else if(theater[2]=''){
            res.send(ejs.render(
                data,
                {session:req.session,result:"true",movielist:movielist,time_lotte:info6.time,seat_lotte:info6.seat,time_cgv:info4.time,seat_cgv:info4.seat,time_mega:info5.time,seat_mega:info5.seat,theater:theater,loc:loc}
            ))
        }
    });
});
// router.get('/', function(req,res){
//     fs.readFile('./public/index.html','utf-8',function(error, data){
//         res.send(data)
//     })
// })


/* 초기 코드 */
// router.get('/',function(req,res){
//     fs.readFile('./public/index.html', 'utf-8', function (error, data) {
//         res.send(ejs.render(
//             data,
//             {movielist:movielist,list_cgv:list_cgv,list_mega:list_mega,theater:theater,loc:loc}
//         ))
//     })
// })
// router.post('/view',function(req,res){
//     var body = req.body;
//     var movie = body.movie
//     var location_cgv = body.location_cgv
//     var location_mega = body.location_mega
//     console.log(movie, " " ,location_cgv, " ",location_mega)
//     var info1;
//     var info2;
//     var options= {
//         mode : 'text',
//         pythonPath: '',
//         pythonOptions: ['-u'],
//         scriptPath: '',
//         args: [movie, location_cgv, location_mega]
//     };

//     PythonShell.run('crawling_test.py', options, function(err, result1){
//         if(err)
//             console.log(err)
//         info1 = JSON.parse(result1);
//         console.log(info1.time)
        
//         PythonShell.run('crawling_test_2.py', options, function(err, result2){
//             info2 = JSON.parse(result2);
//             console.log(info2.time)
        
//             fs.readFile('./public/index.html','utf-8',function(error, data) {
//                 res.send(ejs.render(
//                     data,
//                     {time_cgv:info1.time,seat_cgv:info1.seat,time_mega:info2.time,seat_mega:info2.seat,movielist:movielist,list_cgv:list_cgv,list_mega:list_mega}
//                 ))
//             })
//         })
//     })
// })
module.exports = router;
