const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const studentSchema = new Schema({
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
    role: {
        type: String,
        default: 'student'
    },
    subjects: {
        type: [],
        default: []
    },
    lessons: {
        type: [],
        default: []
    }

},{timestamps: true})


module.exports = mongoose.model('Student', studentSchema);