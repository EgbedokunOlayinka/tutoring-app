const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const subjectSchema = new Schema({
   name: {
       type: String,
       required: true
   },
   tutors: {
       type: [],
       default: []
   }
},{timestamps: true})


module.exports = mongoose.model('Subject', subjectSchema);