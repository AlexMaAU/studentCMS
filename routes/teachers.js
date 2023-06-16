const express = require('express')
const teacherRouter = express.Router()
const {
    getAllTeachers,
    getTeacherById,
    createNewTeacher,
    updateTeacherById,
    deleteTeacherById,
    addCourseToTeacher,
    removeCourseFromTeacher
} = require('../controllers/teachers')

teacherRouter.get('/teachers', getAllTeachers)
teacherRouter.get('/teachers/:teacherId', getTeacherById)
teacherRouter.post('/teachers', createNewTeacher)
teacherRouter.put('/teachers/:teacherId', updateTeacherById)
teacherRouter.delete('/teachers/:teacherId', deleteTeacherById)
teacherRouter.put('/teachers/:teacherId/courses/:courseId', addCourseToTeacher)
teacherRouter.delete('/teachers/:teacherId/courses/:courseId', removeCourseFromTeacher)

module.exports = teacherRouter