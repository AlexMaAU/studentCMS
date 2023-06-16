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
    if(!teacherId) {
        res.status(404).json({error:'Teacher Id is empty'})
        process.exit(0)
    }
    try {
        const teacher = await Teacher.findById(teacherId).exec()
        res.status(201).json(teacher)
    } catch (error) {
        res.status(404).json({error:'No teacher Id found'})
    }
}

const createNewTeacher = async (req,res)=>{
    const {firstName,lastName,email} = req.body
    if(!firstName) {
        res.status(400).json({error:'No first name provided'})
        process.exit(0)
    }
    if(!lastName) {
        res.status(400).json({error:'No last name provided'})
        process.exit(0)
    }
    if(!email) {
        res.status(400).json({error:'No email provided'})
        process.exit(0)
    }
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
    if(!teacherId) {
        res.status(400).json({error:'No teacher ID provided'})
        process.exit(0)
    }
    if(!firstName) {
        res.status(400).json({error:'No first name provided'})
        process.exit(0)
    }
    if(!lastName) {
        res.status(400).json({error:'No last name provided'})
        process.exit(0)
    }
    if(!email) {
        res.status(400).json({error:'No email provided'})
        process.exit(0)
    }
    try {
        const teacher = await Teacher.findByIdAndUpdate(teacherId, {firstName,lastName,email}, {new:true})
        res.status(201).json(teacher)
    } catch (error) {
        res.status(400).json({error})
    }
}

const deleteTeacherById = async (req,res)=>{
    const {teacherId} = req.params
    if(!teacherId) {
        res.status(400).json({error:'No teacher ID provided'})
        process.exit(0)
    }
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
// put teachers/:teacherId/courses/:courseId
const addCourseToTeacher = async (req,res)=>{
    const {teacherId, courseId} = req.params
    if(!teacherId) {
        res.status(404).json({error:'Teacher ID is empty'})
        process.exit(0)
    }
    if(!courseId) {
        res.status(404).json({error:'course ID is empty'})
        process.exit(0)
    }
    try {
        const teacher = await Teacher.findById(teacherId).exec()
        //add course to teacher.courses
        teacher.courses.addToSet(courseId)
        await teacher.save()
        res.status(201).json(teacher)

        //add teacher to course.teachers
        const course = await Course.findById(courseId).exec()
        course.teachers.addToSet(teacherId)
        await course.save()
    } catch (error) {
        res.status(404).json({error:'Failed to add course to teacher'})
    }
}

//removeCourseFromTeacher
// delete teachers/:teacherId/courses/:courseId
const removeCourseFromTeacher = async (req,res)=>{
    const {teacherId, courseId} = req.params
    if(!teacherId) {
        res.status(404).json({error:'Teacher ID is empty'})
        process.exit(0)
    }
    if(!courseId) {
        res.status(404).json({error:'course ID is empty'})
        process.exit(0)
    }
    try {
        //remove course from teacher.courses
        const teacher = await Teacher.findById(teacherId).exec()
        teacher.courses.pull(courseId)
        teacher.save()
        res.status(201).json(teacher)

        //remove teacher from course.teachers
        const course = await Course.findById(courseId).exec()
        course.teachers.pull(teacherId)
        course.save()
    } catch (error) {
        res.status(404).json({error:'Failed to remove course from teacher'})
    }
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    createNewTeacher,
    updateTeacherById,
    deleteTeacherById,
    addCourseToTeacher,
    removeCourseFromTeacher
}