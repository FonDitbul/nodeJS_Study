

const express = require('express')
const router = express.Router()
const path = require('path')
const sanitizeHtml = require('sanitize-html')

const fs = require('fs');
const template = require('../template')
const auth = require('../lib/auth')


// router.use(function(){
//
// });


router.get('/create', (req,res)=> {
    // fs.readdir('./data', function (error, filelist) {
    // console.log(filelist)
    var title = 'WEB - create';
    let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
        '<form action="/topic/create_process" method="post">' +
        '   <p><input type="text" name="title" placeholder="title"></p>' +
        '   <p>' +
        '       <textarea name="description" placeholder="description"></textarea></p>' +
        '   <p>' +
        '       <input type="submit"></p>' +
        '</form>'
    let list = template.List(req.list)
    let tempBody = `<h2>${title}</h2>
                ${formTag}`
    let control = ``

    var templateStr = template.HTML(title, list, tempBody, control,
        auth.statusUI(req,res))
    return res.send(templateStr)
    // })
})

router.post('/create_process', (req,res)=>{
    if(!auth.isOwner(req,res)){
        res.redirect('/')
        return false;
    }
    var post = req.body
    var title = post.title;
    var description = post.description

    fs.writeFile(`data/${title}`, description, 'utf8',(err)=>{
        // if (err) throw err;
        // 파일 생성 저장, 및 302 -> redirection 코드
        // res.writeHead(302, {Location:`http://localhost:3000/topic/${title}`});
        // res.end()
        res.redirect(`/topic/${title}`)
    })
})


router.get('/update/:pageId', (req, res) => {
    // fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8',
        function(err, data){
            let list = template.List(req.list)
            var title = req.params.pageId;
            var description = data;
            let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
                `<form action="/topic/update_process" method="post">` +
                `<input type="hidden" name="id" value="${title}">` +
                `   <p><input type="text" name="title" placeholder="title" value="${title}"></p>` +
                `   <p>` +
                `       <textarea name="description" placeholder="description">${description}</textarea></p>` +
                `   <p>` +
                `       <input type="submit"></p>` +
                `</form>`
            let tempBody =`<h2>${title}</h2>
                        <p>${formTag}</p>`
            let control = `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`

            var templateStr = template.HTML(title, list, tempBody, control,
                auth.statusUI(req,res))
            res.send(templateStr)
        })
    // })
})

router.post('/update_process', (req, res) => {
    if(!auth.isOwner(req,res)){
        res.redirect('/')
        return false;
    }
    var post = req.body;
    var title = post.title;
    var id = post.id
    var description = post.description
    // console.log(post)
    fs.rename(`data/${id}`, `data/${title}`, (error)=>{
        // if(error) return
        // response.writeHead(302, {Location:`/?id=${title}`});
        // response.end();
    } )
    fs.writeFile(`data/${title}`, description, 'utf8',(err)=>{
        if (err) throw err;
        // 파일 생성 저장, 및 302 -> redirection 코드
        // res.writeHead(302, {Location:`/page/${title}`});
        // res.send()
        res.redirect(`/topic/page/${title}`)
    })
})

router.post('/delete_process',(req,res)=>{
        // if(!auth.isOwner(req,res)){
        //     res.redirect('/')
        //     return false;
        // }
        var post = req.body;
        var id = post.id
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`,(error)=>{
            // res.writeHead(302, {Location:`/`});
            // res.end();
            res.redirect('/');
        })
    }
)


router.get('/:pageId', function(req, res,next){
    var filteredId = path.parse(req.params.pageId).base; // base를 통해 상위 디렉토리를 방지하는 코드
    fs.readFile(`data/${filteredId}`, 'utf8',
        function(err, data){
            if(err) next(err); //err 값이 있는 경우 argument가 4개인 미들웨어를 호출하도록 약속
            let list = template.List(req.list)
            let title = req.params.pageId;
            let description = data;

            let sanitizedTitle = sanitizeHtml(title);
            let sanitzedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            })

            let tempBody =`<h2>${sanitizedTitle}</h2>
                        <p>${sanitzedDescription}</p>`
            let control = `<a href="/topic/create">create</a> 
                        <a href="/topic/update/${sanitizedTitle}">update</a>
                        <form action="/topic/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                        </form>
                        `

            var templateStr = template.HTML(title, list, tempBody, control,
                auth.statusUI(req,res))
            res.send(templateStr)
        })
    // return res.send(req.params)
})


module.exports = router;