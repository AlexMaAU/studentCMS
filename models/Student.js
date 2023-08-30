const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
  //Schema里只定义数据的基本类型，其他的校验步骤放到validation里
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  courses: [
    {
      //关联的field，type应该是使用Schema.Types.ObjectId
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
    },
  ],
});

const Student = model('Student', studentSchema);

module.exports = Student;
