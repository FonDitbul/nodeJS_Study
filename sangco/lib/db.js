//lowdb를 사용하는 방법
let low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter);
db.defaults({users:[], topics:[]}).write();

module.exports=db;