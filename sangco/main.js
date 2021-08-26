

const express = require('express')
const app = express()
const fs = require('fs');
const template = require('./template')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')

const session = require('express-session')
//session 값 저장을 위한 새로운 store 모듈 설치 필요
// const FileStore = require('session-file-store')(session) //에러로 인한 삭제

const indexRouter = require('./routes/index')
const topicRouter = require('./routes/topic')
const loginRouter = require('./routes/login')

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))
app.use(compression())
app.use(helmet());

app.use(session({
    secret: 'sa25sxte5',
    resave: false,
    saveUninitialized: true,
    // store:new FileStore({logFn: function(){}})
}))

const passport = require('./lib/passport')(app)

// get 방식만 사용함
app.get('*',function(request, response, next){
    fs.readdir('./data', function(error , filelist){
        request.list = filelist;
        next();
    })
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/login', loginRouter);


app.use(function(req, res, next){
    res.status(404).send('Sorry cant find that!');
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, () => {
    console.log('Example app')
})





/*
const http = require('http');`
const fs = require('fs');
const url = require('url')
const qs = require('querystring')

const path = require('path')
const sanitizeHtml = require('sanitize-html')


const template = require('./template.js')




let app = http.createServer(function(request, response){
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let description = '';

    let templateStr = '';
    if(pathname === '/'){

        if(queryData.id === undefined){ //홈페이지 일 시에 예외처리
            fs.readdir('./data', function(error, filelist){
                // console.log(filelist)
                title = 'Welcome';
                description = 'Hello !! Node.js'
                let list = template.List(filelist)
                let tempBody =`<h2>${title}</h2>
                <p>${description}</p>`
                let control = `<a href="/create">create</a>`

                templateStr = template.HTML(title, list, tempBody, control)
                response.writeHead(200);
                response.end(templateStr)
            })
        }else{
            fs.readdir('./data', function(error, filelist) {
                var filteredId = path.parse(queryData.id).base; // base를 통해 상위 디렉토리를 방지하는 코드
                fs.readFile(`data/${filteredId}`, 'utf8',
                    function(err, data){
                        let list = template.List(filelist)
                        description = data;

                        let sanitizedTitle = sanitizeHtml(title);
                        let sanitzedDescription = sanitizeHtml(description, {
                            allowedTags:['h1']
                        })

                        let tempBody =`<h2>${sanitizedTitle}</h2>
                        <p>${sanitzedDescription}</p>`
                        let control = `<a href="/create">create</a> 
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                        </form>
                        `

                        templateStr = template.HTML(title, list, tempBody, control)
                        response.writeHead(200);
                        response.end(templateStr)
                    })
            })
        }
    }else if(pathname === '/create'){ // create 태그를 클릭 시에 렌더링
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist){
                // console.log(filelist)
                title = 'WEB - create';
                // description = 'Hello !! Node.js'
                let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
                    '<form action="/create_process" method="post">' +
                    '   <p><input type="text" name="title" placeholder="title"></p>' +
                    '   <p>' +
                    '       <textarea name="description" placeholder="description"></textarea></p>' +
                    '   <p>' +
                    '       <input type="submit"></p>' +
                    '</form>'
                let list = template.List(filelist)
                let tempBody =`<h2>${title}</h2>
                ${formTag}`
                let control = ``

                templateStr = template.HTML(title, list, tempBody, control)
                response.writeHead(200);
                response.end(templateStr)
            })
        }
    }else if(pathname === '/create_process'){ // form 에서 전송요청시에
        var body = '';
        request.on('data', function(data){
            body += data;
            // console.log(body)
        });

        request.on('end', function(){
            var post = qs.parse(body);
            title = post.title;
            description = post.description

            fs.writeFile(`data/${title}`, description, 'utf8',(err)=>{
                if (err) throw err;
                // 파일 생성 저장, 및 302 -> redirection 코드
                response.writeHead(302, {Location:`http://localhost:3000/?id=${title}`});
                response.end()
            })
        })
    }else if(pathname === '/update'){ // update form tag
        fs.readdir('./data', function(error, filelist) {
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8',
                function(err, data){
                    let list = template.List(filelist)
                    description = data;
                    let formTag = '' + // post 방식으로 서버에 데이터 전송하는 태그
                        `<form action="/update_process" method="post">` +
                        `<input type="hidden" name="id" value="${title}">` +
                        `   <p><input type="text" name="title" placeholder="title" value="${title}"></p>` +
                        `   <p>` +
                        `       <textarea name="description" placeholder="description">${description}</textarea></p>` +
                        `   <p>` +
                        `       <input type="submit"></p>` +
                        `</form>`
                    let tempBody =`<h2>${title}</h2>
                        <p>${formTag}</p>`
                    let control = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`

                    templateStr = template.HTML(title, list, tempBody, control)
                    response.writeHead(200);
                    response.end(templateStr)
                })
        })
    }else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            title = post.title;
            var id = post.id
            description = post.description
            console.log(post)
            fs.rename(`data/${id}`, `data/${title}`, (error)=>{
                // if(error) return
                // response.writeHead(302, {Location:`/?id=${title}`});
                // response.end();
            } )
            fs.writeFile(`data/${title}`, description, 'utf8',(err)=>{
                if (err) throw err;
                // 파일 생성 저장, 및 302 -> redirection 코드
                response.writeHead(302, {Location:`/?id=${title}`});
                response.end()
            })
        })
    }else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`,(error)=>{
                response.writeHead(302, {Location:`/`});
                response.end();
            })
        })
    }
    else{
        response.writeHead(404);
        response.end('Not found')
    }
})

app.listen(3000)

 */