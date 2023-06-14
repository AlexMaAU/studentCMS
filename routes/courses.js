const express = require('express')
const courseRouter = express.Router()
const Course = require('../models/Course')
const {
    getAllCourses,
    getCourseById,
    createNewCourse,
    updateCourseById,
    deleteCourseById,
    addStudentToCourse,
    removeStudentFromCourse
} = require('../controllers/courses')

courseRouter.get('/courses', getAllCourses)
courseRouter.get('/courses/:courseId', getCourseById)
courseRouter.post('/courses', createNewCourse)
courseRouter.put('/courses/:courseId', updateCourseById)
courseRouter.delete('/courses/:courseId', deleteCourseById)
courseRouter.put('/courses/:courseId/students/:studentId', addStudentToCourse)
courseRouter.delete('/courses/:courseId/students/:studentId', removeStudentFromCourse)

module.exports = courseRouter