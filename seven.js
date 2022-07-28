const express = require('express')
let app = express()
const cors = require('cors')
let Router = require('./router/houtai')
let query = require('./database/mysql.js')
var cookieParser = require('cookie-parser')
const session = require('express-session')
const artTemplate = require('art-template');
const express_template = require('express-art-template');
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  name: 'SESSIONID',  // session会话名称存储在cookie中的键名
  secret: '%#%￥#……%￥', // 必填项，用户session会话加密（防止用户篡改cookie）
  cookie: {  //设置session在cookie中的其他选项配置
    path: '/',
    secure: false,  //默认为false, true 只针对于域名https协议
    maxAge: 60000 * 24,  //设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
  }
}));

app.use(Router)
app.use(express.static(__dirname + '/reference'))
app.use(express.static(__dirname + '/uploads'))
app.set('views', __dirname + '/view/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
//设置视图引擎为上面的html
app.set('view engine', 'html');
// app.get('/cs',async (req,res)=>{
//   // query('SELECT * FROM login').then(data=>{console.log(data);})
//   let autle = await query('SELECT * FROM login')
//   console.log(autle);
//   res.send("1111")
// })

app.listen(3300, () => {
  console.log('启动成功');
})