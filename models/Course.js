const {Schema, model} = require('mongoose')

const courseSchema = Schema({
    name: {
        type:String
    },
    description: {
        type:String
    },
    students: [
        {
            type:Schema.Types.ObjectId,
            ref:'Student'
        }
    ],
    teachers: {
        
    }
})

const Course = model('Course', courseSchema)

module.exports = Course