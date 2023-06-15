const Teacher = require('../models/Teacher')
const Course = require('../models/Course')

const getAllTeachers = async (req,res)=>{
    // try..catch 这部分，也可以提取到 Index.js 中，在调用Router中间件的时候统一进行 try..catch 处理
    // 也可以单独设置一个 error handling 中间件，通过 next 把错误导入错误处理中间件的流程
    try {
        const teachers = await Teacher.find().populate('courses').exec()
        res.status(201).json(teachers)
    } catch (error) {
        res.status(404).json({error:'No teacher data found'})
    }
}

const getTeacherById = async (req,res)=>{
    const {teacherId} = req.params
    try {
        if(!teacherId) {
            res.status(404).json({error:'Teacher Id is empty'})
            process.exit(0)
        }
        const teacher = await Teacher.findById(teacherId).exec()
        res.status(201).json(teacher)
    } catch (error) {
        res.status(404).json({error:'No teacher Id found'})
    }
}

const createNewTeacher = async (req,res)=>{
    const {firstName,lastName,email} = req.body
    try {
        const newTeacher = new Teacher({firstName,lastName,email})
        await newTeacher.save()
        res.status(201).json(newTeacher)
    } catch (error) {
        res.status(400).json({error})
    }
}

const updateTeacherById = async (req,res)=>{
    const {teacherId} = req.params
    const {firstName,lastName,email} = req.body
    try {
        if(!teacherId) {
            res.status(404).json({error:'Teacher Id is empty'})
            process.exit(0)
        }
        const teacher = await Teacher.findByIdAndUpdate(teacherId, {firstName,lastName,email}, {new:true})
        res.status(201).json(teacher)
    } catch (error) {
        res.status(400).json({error})
    }
}

const deleteTeacherById = async (req,res)=>{
    const {teacherId} = req.params
    try {
        if(!teacherId) {
            res.status(404).json({error:'Teacher Id is empty'})
            process.exit(0)
        }
        const teacher = await Teacher.findByIdAndDelete(teacherId).exec()
        res.status(201).json(teacher)
    } catch (error) {
        res.status(400).json({error})
    }
}

//addCourseToTeacher
//add course to teacher.courses
//add teacher to course.teachers


//removeCourseFromTeacher
//remove course from teacher.courses
//remove teacher from course.teachers


module.exports = {
    getAllTeachers,
    getTeacherById,
    createNewTeacher,
    updateTeacherById,
    deleteTeacherById
}