const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    subjects: {
        default: []
    },
    adminstatus: {
        type: Boolean,
        default: false
    }

},{timestamps: true})


module.exports = mongoose.model('Tutor', tutorSchema);