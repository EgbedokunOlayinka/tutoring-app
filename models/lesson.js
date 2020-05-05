const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subject = require('./subject');
const Tutor = require('./tutor')
const Student = require('./student');

const lessonSchema = new Schema({
    tutor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor'
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }
},{timestamps:true})


module.exports = mongoose.model('Lesson', lessonSchema);