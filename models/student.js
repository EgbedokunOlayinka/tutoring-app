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
    subjects: {
        default: []
    },
    lessons: {
        default: []
    }

},{timestamps: true})


module.exports = mongoose.model('Student', studentSchema);