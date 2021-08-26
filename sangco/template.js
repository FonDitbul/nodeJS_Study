module.exports = {
    HTML:function(title, list, body, control, authStatusUI='<a href="/login">login</a> | <a href="/login/register">Register</a>'){
        return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
        ${body}
    </body>
    </html>
    `},
    List:function (filelist){
        let list = '<ul>'
        // console.log(filelist)
        filelist.forEach(index=>{
            // console.log(index)
            list += `<li><a href="/topic/${index}">${index}</a></li>`
        })
        list = list+'</ul>'
        return list
    }
}