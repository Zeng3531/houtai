const mysql = require('mysql')
let connection = mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'root',
    database:'mingde2201'
})
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log('链接成功');
})

module.exports = connection