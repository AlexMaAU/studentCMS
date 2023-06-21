const Student = require('../models/Student')
const Course = require('../models/Course')

const getAllStudents = async (req, res)=>{
    //回调函数只负责查询数据，错误处理的职责可以提取到单独的错误处理中间件中
    try {
        //新建的model实例相当于是collection，所以Student.find()操作等于是从Student collection中去进行find()操作
        //因为Student关联了Course，所以为了看见完整的内容，需要populate
        const students = await Student.find().populate('courses').exec()
        res.status(201).json(students)
    } catch (error) {
        res.status(404).json({error:'No student data found'})
    }
}

const getStudentById = async (req,res)=>{
    const {studentId} = req.params
    if(!studentId) {
        res.status(400).json({code:0, error:'No students ID provided'})
        process.exit(0)
    }
    try {
        const student = await Student.findById(studentId).populate('courses').exec()
        res.status(201).json(student)
    } catch (error) {
        res.status(404).json({error:'No student ID found'})
    }
}

const createNewStudent = async (req,res)=>{
    const {firstName,lastName,email} = req.body
    if(!firstName) {
        res.status(400).json({code:0, error:'No first name provided'})
        process.exit(0)
    }
    if(!lastName) {
        res.status(400).json({code:1, error:'No last name provided'})
        process.exit(0)
    }
    if(!email) {
        res.status(400).json({code:2, error:'No email provided'})
        process.exit(0)
    }
    try {
        //Student model中绑定了Course model，所以还需要建立Course model
        const newStudent = await new Student({firstName,lastName,email}).save()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({error:'Failed to create a new student'})
    }
}

//这里的学生信息更新方式，是每次都要直接更新整个的学生信息内容
//如果把给学生添加课程和移除课程的操作也放在这个endpoint进行，那么每次更新学生都需要把整个courses都重新覆盖一次，这样很不合理。
//而且每个学生对应多个Course，一般遇到 1：N 的情况，都会再设置一层路径，把endpoint单独分开
// 比如：/students/:studentId/courses/:courseId
// /students/:studentId 确定是哪个学生
// /courses/:courseId 确定这个学生下的哪个课程
const updateStudentById = async (req,res)=>{
    const {studentId} = req.params 
    const {firstName,lastName,email} = req.body
    if(!studentId) {
        res.status(400).json({code:0, error:'No ID provided'})
        process.exit(0)
    }
    if(!firstName) {
        res.status(400).json({code:1, error:'No first name provided'})
        process.exit(0)
    }
    if(!lastName) {
        res.status(400).json({code:2, error:'No last name provided'})
        process.exit(0)
    }
    if(!email) {
        res.status(400).json({code:3, error:'No email provided'})
        process.exit(0)
    }
    try {
        //一般开发中，对关联数据的操作，特别是关联数据可以是多个的时候(数组形式)，会设置为二级、三级路径，然后对该路径进行单独的处理
        //这里Student Model里关联的courses是数组，一个学生可以关联多个course
        //比如：
        // put /courses/:courseId/students/:studentId
        // put /courses/:courseId/teachers/:teacherId
        const updatedStudent = await Student.findByIdAndUpdate(studentId,{firstName,lastName,email},{new:true}).populate('courses').exec()
        res.status(201).json(updatedStudent)
    } catch (error) {
        res.status(404).json({error:'No student id found'})
    }
}

//需要给学生每次增加一个Course或者移除一个Course的操作，可以使用下面的endpoint方式
// put /students/:studentId/courses/:courseId
// 把新的Course关联添加到Student的courses下
const addCourseToStudent = async (req,res)=>{
    const {studentId,courseId} = req.params
    // 重点：后端需要考虑的事情
    // 1. 数据检查 - 要确保防止各种可能存在的问题，比如前端传来的是空数据、假数据等
    // 2. 流程控制 - 要确保那些函数优先执行，把会报错的先做错误处理
    // 3. 精确反馈 - 通过status code、根据不同情况设置不同的response等方法，尽可能的精准向前端反馈执行结果和错误信息
    if(!studentId) {
        res.status(404).json({code:0, error:'student ID is empty'})
        process.exit(0)
    }
    if(!courseId) {
        res.status(404).json({code:1, error:'course ID is empty'})
        process.exit(0)
    }

    try {
        //在 student 下添加新的 course 关联
        const student = await Student.findById(studentId).exec()
        student.courses.addToSet(courseId)
        await student.save()
        res.status(201).json(student)

        //但是 student 和 course 是双向绑定的，那么这个同时 course 下也应该新增加对应的 student 关联
        const course = await Course.findById(courseId).exec()
        course.students.addToSet(studentId)
        await course.save()
    } catch (error) {
        res.status(404).json({error})
    }
}

//把Course从Student的courses下删除
// delete /students/:studentId/courses/:courseId
const removeCourseFromStudent = async(req,res)=>{
    const {studentId, courseId} = req.params 
    if(!studentId) {
        res.status(404).json({code:0, error:'student ID is empty'})
        process.exit(0)
    }
    if(!courseId) {
        res.status(404).json({code:1, error:'course ID is empty'})
        process.exit(0)
    }
    try {
        //在 student 下删除一条 course 关联
        const student = await Student.findById(studentId).exec()
        student.courses.pull(courseId)
        await student.save()
        res.status(201).json(student)
        //但是 student 和 course 是双向绑定的，那么这个同时 course 下也应该删除对应的 student 关联
        const course = await Course.findById(courseId).exec()
        course.students.pull(studentId)
        await course.save()
    } catch (error) {
        res.status(404).json({error:'Invalid ID'})
    }
}

const deleteStudentById = async (req,res)=>{
    const {studentId} = req.params
    if(!studentId) {
        res.status(400).json({code:0, error:'No ID provided'})
        process.exit(0)
    }
    try {
        const deletedStudent = await Student.findByIdAndRemove(studentId).exec()
        res.status(201).json(deletedStudent)
    } catch (error) {
        res.status(404).json({error:'No student id found'})
    }
}

/**
 * export.function和export default是ES6模块系统的导出语法，适用于现代浏览器和支持ES6模块的环境。
 * export.function用于具名导出，而export default用于默认导出。
 */
module.exports = {
    getAllStudents,
    getStudentById,
    createNewStudent,
    updateStudentById,
    addCourseToStudent,
    removeCourseFromStudent,
    deleteStudentById
}