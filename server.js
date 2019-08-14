const { User } = require('./deb.js')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const SECRET = 'token_secret'


app.use(express.json())
//
app.get('/api/user', async (req, res) => {

    const user = await User.find()
    res.send(user)
})

//注册接口
app.post('/api/register', async (req, res) => {

    const user = await User.create({
        username: req.body.username,
        passworld: req.body.passworld
    })

    // console.log(user)
    res.send(user)
})
//登录接口  判断用户是否存在 存在就匹配密码 正确就生成token
app.all('/api/login', async (req, res) => {

    //首先看存不存在 不存在就注册 存在就进行密码匹配
    //然后返回token
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        //用户不存在给出status状态和错误信息
        return res.status(444).send({
            msg: '用户名不存在'
        })
    }
    //如果用户存在就要检验密码 他们自动对比
    const ispassword = require('bcrypt').compareSync(
        //客户端传过来的密码
        req.body.passworld,
        //数据库的密码
        user.passworld
    )
    if (!ispassword) {
        //用户不存在给出status状态和错误信息
        return res.status(444).send({
            msg: '密码错误'
        })
    }
    //注册的时候生成token
    //生成token 只需要传id方便客户端请求携带的时候只有id 不能带上密码  jwt  SECRET秘钥
    const token = jwt.sign({ id: String(user._id) }, SECRET)
    
    
    //返回token
    res.send({
        user,
        token
    })
})


//个人信息接口 
app.get('/api/message', async (req, res) => {
    //得到客户端传过来的完整token
    const token=String(req.headers.authorization).split(' ')[1]
   //有token就找到解析 没有就报错 
if(token){
        //解密出来{ id: '5d53e6a3ecb0aa26eccaee6f', iat: 1565780386 }看数据库有没有这个id
    const { id }=jwt.verify(token,SECRET)

//解构出来只要id 通过id 在数据库查到

    const user=await User.findById(id)
  //    console.log(user)
    //把用户信息返回给客户端 请求的时候必须有带token
    res.send(user)

}else{
    return res.status(401).send({
        msg: '没有或无效token'
    })

}
})


app.listen(3001, () => {
    console.log('http://localhost:3001服务器启动')
})