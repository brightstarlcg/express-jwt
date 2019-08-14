const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/express',{
    useCreateIndex:true,
    useNewUrlParser:true
})


const User=mongoose.model('Userk', new mongoose.Schema({
    username:{
        type:String,
        unique:true
       
      },
      passworld:{
        type:String,
        //使用bcrypt进行加密
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
       
      },
}))
//删除数据库 自动创建users集合
// User.db.dropCollection('users')
module.exports={
    User
}