const express = require('express');
const studentRouter = express.Router();
const {
  getAllStudents,
  getStudentById,
  createNewStudent,
  updateStudentById,
  addCourseToStudent,
  removeCourseFromStudent,
  deleteStudentById,
} = require('../controllers/students');

//student.js只负责路由分发的职责，路由的具体操作再单独拆分到students.js的controller中
studentRouter.get('/students', getAllStudents);
studentRouter.get('/students/:studentId', getStudentById);
studentRouter.post('/students', createNewStudent);
studentRouter.put('/students/:studentId', updateStudentById);
studentRouter.put('/students/:studentId/courses/:courseId', addCourseToStudent);
studentRouter.delete(
  '/students/:studentId/courses/:courseId',
  removeCourseFromStudent
);
studentRouter.delete('/students/:studentId', deleteStudentById);

module.exports = studentRouter;
