const { Schema, model } = require('mongoose');

const courseSchema = Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: false,
    },
  ],
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: false,
    },
  ],
});

const Course = model('Course', courseSchema);

module.exports = Course;
