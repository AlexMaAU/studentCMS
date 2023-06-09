const mongoose = require('mongoose')
const DB_CONNECT = process.env.DB_CONNECT

const connectDB = async ()=>{
    if(!DB_CONNECT) {
        console.log('DB_CONNECT is empty')
        process.exit(0)
    }
    mongoose.connect(DB_CONNECT)
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB is connected')
    })
    mongoose.connection.on('error', ()=>{
        console.log('MongoDB has error')
        process.exit(1)
    })
    mongoose.connection.on('disconnected', ()=>{
        console.log('DB disconnected')
        process.exit(2)
    })
}

module.exports = connectDB