const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subject = require('./subject');
const Lesson = require('./lesson');


const tutorSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'tutor'
    },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
    ,
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],

    adminstatus: {
        type: Boolean,
        default: false
    },

    activation_status: {
        type: Boolean,
        default: true
    }

},{timestamps: true})


module.exports = mongoose.model('Tutor', tutorSchema);