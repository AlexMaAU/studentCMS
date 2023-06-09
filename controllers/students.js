const Student = require('../models/Student')

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
    try {
        const {id} = req.params
        if(!id) {
            res.status(400).json({error:'No ID provided'})
            process.exit(0)
        }
        const student = await Student.findById(id).populate('courses').exec()
        res.status(201).json(student)
    } catch (error) {
        res.status(404).json({error:'No student ID found'})
    }
}

const createNewStudent = async (req,res)=>{
    try {
        const {firstName,lastName,email,courses} = req.body
        //Student model中绑定了Course model，所以还需要建立Course model
        const newStudent = await new Student({firstName,lastName,email,courses}).populate('courses').save()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({error:'Failed to create a new student'})
    }
}

const updateStudentById = async (req,res)=>{
    try {
        const {id,firstName,lastName,email} = req.body
        if(!id) {
            res.status(400).json({error:'No ID provided'})
            process.exit(0)
        }
        //一般开发中，对关联数据的操作，特别是关联数据可以是多个的时候(数组形式)，会设置为二级、三级路径，然后对该路径进行单独的处理
        //这里Student Model里关联的courses是数组，一个学生可以关联多个course
        //比如：
        // put /courses/:courseId/students/:studentId
        // put /courses/:courseId/teachers/:teacherId
        const updatedStudent = await Student.findByIdAndUpdate(id,{firstName,lastName,email},{new:true}).populate('courses').exec()
        res.status(201).json(updatedStudent)
    } catch (error) {
        res.status(401).json({error:'No student id found'})
    }
}

// put /students/:studentId/courses/:courseId
// 把新的Course关联添加到Student的courses下
const addCourseToStudent = async (req,res)=>{
    try {
        const {studentId,courseId} = req.params
        if(!studentId || !courseId) {
            res.status(404).json({error:'ID is empty'})
            process.exit(0)
        }
        //在 student 下添加新的 course 关联
        const student = await Student.findById(studentId).exec()
        student.courses.addToSet(courseId)
        await student.save()
        res.json(student)

        //但是 student 和 course 是双向绑定的，那么这个同时 course 下也应该新增加对应的 student 关联
        // TO DO ...here
        


        
        


    } catch (error) {
        res.status(401).json({error:'No student id found'})
    }
}

//把Course从Student的courses下删除


const deleteStudentById = async (req,res)=>{
    try {
        const {id} = req.body
        if(!id) {
            res.status(400).json({error:'No ID provided'})
            process.exit(0)
        }
        const deletedStudent = await Student.findByIdAndRemove(id).populate('courses').exec()
        res.status(201).json(deletedStudent)
    } catch (error) {
        res.status(401).json({error:'No student id found'})
    }
}

/**
 * export.function和export default是ES6模块系统的导出语法，适用于现代浏览器和支持ES6模块的环境。
 * export.function用于具名导出，而export default用于默认导出。
 */
module.exports = {getAllStudents,getStudentById,createNewStudent,updateStudentById,addCourseToStudent,deleteStudentById}