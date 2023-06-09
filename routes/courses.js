const express = require('express')
const courseRouter = express.Router()
const Course = require('../models/Course')

courseRouter.get('/courses', async (req,res)=>{
    //后端的两个原则：
    //但凡有可能出错的地方都要考虑容错机制
    //永远不要相信前端传来的数据，一定要再次验证
    try {
        const courses = await Course.find().populate('students').exec()
        res.status(201).json(courses)
    } catch (error) {
        res.status(404).json({error:'No data found'})
    }
})

courseRouter.get('/courses/:courseId', async (req,res)=>{
    //后端的两个原则：
    //但凡有可能出错的地方都要考虑容错机制
    //永远不要相信前端传来的数据，一定要再次验证
    try {
        const {id} = req.params
        const course = await Course.findById(id).populate('students').exec()
        //养成良好的代码习惯，每个response都应该加上网络状态码
        res.status(201).json(course)
    } catch (error) {
        res.status(404).json({error:'No Course ID found'})
    }
})

courseRouter.post('/courses', async (req,res)=>{
    try {
        const {name,description,students,teachers} = req.body
        const newCourse = await new Course({name,description,students,teachers}).save()
        res.json(newCourse)
    } catch (error) {
        res.status(400).json({error:'fail to create data'})
    }
})

courseRouter.put('/courses', async (req,res)=>{
    try {
        //下面注释掉的这个方法有什么问题？更改name和description是修改Course的数据值，属于相同的功能，可以放在body里一起传入
        //但是把Course中关联的Student和Teacher进行添加删除操作，是额外的职责，应该单独划分出去
        //一般开发中，对关联数据的设置，特别是关联数据可以是多个的时候(数组形式)，会为二级、三级路径，然后对该路径进行单独的处理
        //这里Course Model里关联的students和teachers都是数组，一个课程可以关联多个学生。
        //如果是直接从/courses里传递数据，那么每次修改都要把完整的students和teachers数组传一次，如果数组很大的话，req.body都可能装不下。
        //而且如果是统一从/courses里传递数据，那么对特定的course添加特定的student或者teacher这个功能实现起来会很麻烦
        //比如这里可以是：
        // put /courses/:courseId/students/:studentId

        /*
        const {id,name,description,students,teachers} = req.body
        const updated = await Course.findOneAndUpdate(id,{name,description,students,teachers},{new:true}).exec()
        res.status(201).json(updated)
        */
        const {id,name,description} = req.body
        const updated = await Course.findOneAndUpdate(id,{name,description},{new:true}).exec()
        res.status(201).json(updated)
    } catch (error) {
        res.status(404).json({error:'No Course ID found'})
    }
})

courseRouter.delete('/courses/:courseId', async (req,res)=>{
    try {
        const {id} = req.params
        const deleted = await Course.findByIdAndDelete(id).exec()
        res.status(201).json(deleted)
    } catch (error) {
        res.status(404).json({error:'No Course ID found'})
    }
})



module.exports = courseRouter