const http = require('http')
const cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    let cookies = {};
    if(request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
    }
    response.writeHead(200,{
        'Set-Cookie' : ['jeongYunsang=heavy',
        'sinjunyoung=buuuuuuuungsin',
        `Permanent=cookies; Max-Age=${60*60*24*30}`,
        'Secure=Secure; Secure',
        'HttpOnly=HttpOnly; HttpOnly',
        'Path=Path; Path=/cookie',
        'Domain=Domain; Domain=o2.org']
    })
    response.end('Cookie!!');
}).listen(3000)


//Session cookies

//Permanent cookies
// 날짜를 지정하는 cookies
