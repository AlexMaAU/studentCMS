const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./utils/db')
const studentRouter = require('./routes/students')
const courseRouter = require('./routes/courses')
const teacherRouter = require('./routes/teachers')

const PORT = process.env.PORT || 3000

app.use(express.json())
//use()函数的职责是使用路由中间件，中间件的具体代码可以分拆到 routes-students.js 中
app.use(studentRouter)
app.use(courseRouter)
app.use(teacherRouter)

//app.js的职责是调用中间件，那么启动服务器的功能其实也需要拆出来到express.js中
//这样的话express.js的职责是建立express服务器，db.js的职责是连接数据库
connectDB().then(
    app.listen(PORT, ()=>{
        console.log(`server running at http://127.0.0.1:${PORT}`)
    })
).catch((error)=>{
    console.log(error)
})

//写API的顺序
/**
 * 入口文件 
 * --> Server启动 
 * --> DB连接 
 * [--> 客户端通过URL发送服务器请求]
 * --> Router处理访问路径匹配，分发路由 
 * --> Controller处理请求 
 * --> (如果需要从第三方API获取数据) Controller中通过axios或者fetch请求并获取数据
 * --> (如果需要从第三方API获取数据) Controller中将获取到的数据进行逻辑处理后返回response
 * --> (如果需要数据库交互) Model导出数据库的Model实例 
 * --> (如果需要数据库交互)Controller中通过Model实例操作数据库，并返回response
 * [--> 客户端接收response拿到数据]
 */

