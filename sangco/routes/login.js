const express = require('express')
const router = express.Router()
const template = require('../template')
const cookie = require('cookie-parser')
const db = require('../lib/db')
//shortid를 통한 id 생성
const shortid = require('shortid')
const bcrypt = require('bcrypt');

module.exports = function(passport){
    router.get('/', (req,res)=>{
        var title = `Login`;
        let list = template.List(req.list)
        let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
            '<form action="/login/login_process" method="post">' +
            '   <p><input type="text" name="email" placeholder="ID"></p>' +
            // '   <p><input type="text" name="nickname" placeholder="닉네임"></p>' +
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
        if(password !== password2){
            // res.send('error')
            res.redirect('/login/register')
        }else{
            bcrypt.hash(password, 10, function(err, hash){
                const user = {
                    id:shortid.generate(),
                    email:email,
                    nickname: nickname,
                    password:hash
                }
                db.get('users').push(user).write();
                req.login(user, function(err){
                    return res.redirect('/');
                })
            })

        }
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
        req.session.save(function () { //session 값을 저장함
            res.redirect('/')
        })
    })
    return router;
}


