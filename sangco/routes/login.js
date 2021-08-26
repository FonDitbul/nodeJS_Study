
module.exports = function(passport){
    const express = require('express')
    const router = express.Router()
    const template = require('../template')
    const cookie = require('cookie-parser')

    //lowdb를 사용하는 방법
    let low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('db.json')
    const db = low(adapter);
    db.defaults({users:[]}).write();

    router.get('/', (req,res)=>{
        var title = `Login`;
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

    router.get('/register', (req,res)=>{
        var title = 'Login';
        let list = template.List(req.list)
        let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
            '<form action="/login/register_process" method="post">' +
            '   <p><input type="text" name="email" placeholder="ID"></p>' +
            '   <p><input type="text" name="nickname" placeholder="닉네임"></p>' +
            '   <p>'+
            '       <input type="password" name="password" placeholder="password"></input></p>'+
            '       <input type="password" name="password2" placeholder="passwordConfirm"></input></p>' +
            '   <p>' +
            '       <input type="submit"></p>' +
            '</form>'

        let tempBody = `<h2>${title}</h2>
                ${formTag}`
        let control = ``

        var templateStr = template.HTML(title, list, tempBody, control)
        res.send(templateStr)
    })

    router.post('/register_process', (req,res)=>{
        var post = req.body
        var email = post.email;
        var nickname = post.nickname
        var password = post.password;
        var password2 = post.password2

        db.get('users').push({
            email:email,
            nickname: nickname,
            password:password
        }).write();
    })

    router.post('/login_process',
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    )

    router.get('/logout_process', (req, res) => {
        req.logout();
        // req.session.destroy(function(){ // session을 지우는 function
        //     res.redirect('/')
        // })
        req.session.save(function () {
            res.redirect('/')
        })
    })
    return router;
}


