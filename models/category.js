const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subject = require('./subject');



const categorySchema = new Schema({
   name: {
       type: String,
       required: true
   },
   subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
},{timestamps: true})



categorySchema.pre('remove', async function(next){
    const category = this;
    Subject.deleteMany({category: category._id})
    next();
})

module.exports = mongoose.model('Category', categorySchema);