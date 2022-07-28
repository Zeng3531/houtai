const query = require('../database/mysql.js')
const path = require('path')
const fs = require('fs')
const { Router } = require('express')
const app = Router()
let getinterface = {}
let secret = "^&%^&*&((";
const md5 = require('md5')
let CryptoJS = require('crypto-js')
const multer = require('multer')
const upload = multer({
    dest: 'uploads/'
})

getinterface.login = (req, res) => {

    res.sendFile(path.join(__dirname, '../view/login.html'))
}

getinterface.index = (req, res) => {
    let { key } = req.cookies;
    if (key) {
        res.sendFile(path.join(__dirname, '../view/index.html'))
    } else if (req.session.key) {
        res.sendFile(path.join(__dirname, '../view/index.html'))
    }
}

getinterface.book = async (req, res) => {
    let sql = 'select * from thebook where isdelete!=1 ;'
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.json({
            code: 0,
            data: data
        })
    })
}
getinterface.fenbook = async (req, res) => {

    let { page, limit } = req.query
    page = (page - 1) * limit
    let num = 0
    let sql1 = `select * from thebook where isdelete!=1;`
    query.query(sql1, (err, data) => {
        if (err) {
            console.log(err);
        }

        data.forEach((a, b) => {
            num = b
        });
    })

    let sql = `select * from thebook where isdelete!=1 limit ${page},${limit};`

    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.json({
            code: 0,
            data: data,
            count: num

        })
    })
}

getinterface.deletebook = async (req, res) => {
    let sql = 'select * from thebook where isdelete=1;'
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.json({
            code: 0,
            data: data
        })
    })
}

getinterface.delete = (req, res) => {
    let deleteid = req.body.nameid
    let sql = `update thebook set isdelete = 1 where id = ${deleteid};`
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
    res.json({
        name: '小白'
    })
}


getinterface.restore = (req, res) => {
    let deleteid = req.body.name
    console.log('我是body', req.body);
    let sql = `update thebook set isdelete = 0 where id = ${deleteid};`
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
    res.json({
        name: '小白'
    })
}

getinterface.validation = (req, res) => {
    let username = req.body.username
    let password = req.body.password
    password = md5(password)
    let check = req.body.check
    let sql = `SELECT * FROM login WHERE account='${username}' and password='${password}'`
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.length != 0) {
            if (check) {
                res.cookie('key', 'Kebi', {
                    // 北京时间是中国采用国际时区东八时区的区时作为标准时间
                    // 东八区与中时区相差了八个小时
                    expires: new Date(Date.now() + 8 * 2 * 3600000) // cookie will be removed after 8 hours
                })

                // req.session.key.expires = new Date((Date.now() + 8 * 2 * 3600000))

            } else {
                res.cookie('thename', username)
                req.session.key = 'Kebi';
            }
            req.session.username = username
            res.json('账号密码正确')
        } else {
            res.json('账号密码错误')
        }
    })

}
getinterface.registered = (req, res) => {
    console.log(req.body)
    let username = req.body.usernamereg

    let passreg = req.body.passreg
    passreg = md5(passreg)
    let invitation = req.body.invitation
    let sql = `SELECT * FROM invitation WHERE invitation = ${invitation}`
    query.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.length != 0) {
            let sql1 = `insert into login(account,password)value(${username},'${passreg}')`
            query.query(sql1, (err, data) => {
                if (err) {
                    console.log(err);
                }
                console.log(data);
            })

            res.json('注册成功')
        } else {
            res.json('邀请码错误请输入正确的邀请码')
        }
    })
}

getinterface.avatar = (req, res) => {
    // 只有上传了文件，才进行文件的重命名（fs.rename(旧名字,新名字)）
    if (req.file) {
        let {
            destination,
            originalname,
            filename
        } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let shangyiji = '../' + destination
        let oldName = path.join(__dirname, shangyiji, filename);
        let newName = path.join(__dirname, shangyiji, filename) + extName;

        fs.rename(oldName, newName, (err) => {
            if (err) throw err;
            console.log('success')
        })
        let portrait = filename + extName
        let sql = `insert into historypicture(portrait)value('${portrait}')`
        query.query(sql, (err, data) => {
            if (err) {
                console.log(err);
            }

        })

        let sql1 = `update login SET theimg='${portrait}' WHERE account =${req.session.username} `
        query.query(sql1, (err, data) => {
            if (err) {
                console.log(err);
            }

        })

        res.cookie('portrait', `${portrait}`, {
            // 北京时间是中国采用国际时区东八时区的区时作为标准时间
            // 东八区与中时区相差了八个小时
            expires: new Date(Date.now() + 8 * 2 * 3600000) // cookie will be removed after 8 hours
        })
        res.json({
            code: 200
        })
    } else {
        res.json({
            code: 0
        })
    }
}

getinterface.scfile = (req, res) => {
    res.render('scfile.html')
}

getinterface.recycling = (req, res) => {
    res.render('recycling.html', { name: '123' })
}

getinterface.duohang = (req, res) => {
    res.render('duohang.html')
}

getinterface.increase = (req, res) => {
    res.render('increase.html')
}

// 添加书籍
getinterface.insert = (req, res) => {
    console.log(req.body);
    let sql1 = `insert into thebook(bookname,numGB,title,isdelete,strdelete,bookimg)value('${req.body.title}','${req.body.password}','${req.body.city}','0','删除','${req.body.booksconten}')`
    query.query(sql1, (err, data) => {
        if (err) {
            console.log(err);
        }

    })
    res.json('收到了大帅哥')
}
getinterface.apiUpload = (req, res) => {
    try {
        let { filename, path: relativepath, originalname } = req.file
        let subori = originalname.substring(originalname.lastIndexOf('.'))
        console.log(filename + subori);
        fs.renameSync(relativepath, relativepath + subori)
        res.json({
            "errno": 0, // 注意：值是数字，不能是字符串
            "data": {
                "url": filename + subori, // 视频 src ，必须
            }
        })
    } catch {
        res.json({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        }
        )
    }

}





// 编辑书籍
// getinterface.insert = (req, res) => {
//     console.log(req.body);
//     let sql1 = `insert into thebook(bookname,numGB,title,isdelete,strdelete,bookimg)value('${req.body.title}','${req.body.password}','${req.body.city}','0','删除','${req.body.booksconten}')`
//     query.query(sql1, (err, data) => {
//         if (err) {
//             console.log(err);
//         }
//     })
//     res.json('收到了大帅哥')
// }


getinterface.editArticle =(req, res) => {
    res.render('editArticle.html')
}



// 托管的资源
app.get('/', getinterface.login)
app.get('/index', getinterface.index)
app.get('/recycling', getinterface.recycling)
app.get('/book', getinterface.book)
app.get('/duohang', getinterface.duohang)
app.get('/increase', getinterface.increase)
app.get('/editArticle', getinterface.editArticle)
app.get('/deletebook', getinterface.deletebook)
app.get('/fenbook', getinterface.fenbook)
app.get('/scfile', getinterface.scfile)
app.post('/restore', getinterface.restore)
app.post('/validation', getinterface.validation)
app.post('/delete', getinterface.delete)
app.post('/registered', getinterface.registered)
app.post('/avatar', upload.single('file'), getinterface.avatar)
app.post('/insert', upload.single(), getinterface.insert)
app.post('/api/upload', upload.single('your-custom-name'), getinterface.apiUpload)
module.exports = app