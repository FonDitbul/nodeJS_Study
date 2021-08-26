const express = require('express')
const router = express.Router()

const template = require('../template')
const cookie = require('cookie-parser')


const authData = {
    email:'niki7084@naver.com',
    password:'sk7083',
    nickname:'FADFAD'
}


router.get('/', (req,res)=>{
    var title = 'Login';
    let list = template.List(req.list)
    let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
        '<form action="/login/login_process" method="post">' +
        '   <p><input type="text" name="email" placeholder="ID"></p>' +
        '   <p><input type="text" name="nickname" placeholder="닉네임"></p>' +
        '   <p>'+
        '       <input type="password" name="password" placeholder="password"></input></p>' +
        '   <p>' +
        '       <input type="submit"></p>' +
        '</form>'

    let tempBody = `<h2>${title}</h2>
                ${formTag}`
    let control = ``

    var templateStr = template.HTML(title, list, tempBody, control)
    res.send(templateStr)
})

router.post('/login_process',(req,res)=>{
    const post = req.body;
    const email = post.email
    const password = post.password;
    // console.log(req.headers.cookie)
    // console.log(req.cookies) // cookie parser를 이용한 cookie parse
    if(post.email === 'niki7084@naver.com' && post.password === 'sk7083'){
       req.session.is_logined = true;
       req.session.nickname = authData.nickname
        req.session.save(function(){
            res.redirect('/');
        })
    }else{
        const alert = `
        'Invalid id and paswword'
        `
        res.send(alert)
    }
    // console.log(email, password)
})

router.get('/logout_process', (req,res)=>{
    req.session.destroy(function(){
        res.redirect('/')
    })
})
module.exports = router;
