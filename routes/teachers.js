const express = require('express')
const teacherRouter = express.Router()
const {
    getAllTeachers,
    getTeacherById,
    createNewTeacher,
    updateTeacherById,
    deleteTeacherById
} = require('../controllers/teachers')

teacherRouter.get('/teachers', getAllTeachers)
teacherRouter.get('/teachers/:teacherId', getTeacherById)
teacherRouter.post('/teachers', createNewTeacher)
teacherRouter.put('/teachers/:teacherId', updateTeacherById)
teacherRouter.delete('/teachers/:teacherId', deleteTeacherById)

module.exports = teacherRouter