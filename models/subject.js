const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./category');
const Tutor = require('./tutor')


const subjectSchema = new Schema({
   name: {
       type: String,
       required: true
   },
   category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    
    },
   tutors: [{ type: Schema.Types.ObjectId, ref: 'Tutor' }]
},{timestamps: true})



module.exports = mongoose.model('Subject', subjectSchema);