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



// subjectSchema.pre('remove', function(next){
//     Category.remove({id:this._id}).exec()
//     next();
// });

// subjectSchema.pre('remove', function(next) {
//     this.model('Category').remove({ _id: this._id }, next);
//     next();
// });

// subjectSchema.pre('remove', function(next) {
//     Category.remove(
//         { _id : this._id}, 
//         { $pull: { _id: this._id } },
//         { multi: false })  //if reference exists in multiple documents 
//     .exec();
//     next();
// });

// subjectSchema.post("remove", document => {
//     const subjectId = document._id;
//     Category.find({ subjects: { $in: [subjectId] } }).then(categories => {
//       Promise.all(
//         categories.map(category =>
//           Category.findOneAndUpdate(
//             category._id,
//             { $pull: { subjects: subjectsId } },
//             { new: true }
//           )
//         )
//       );
//     });
//   });

// subjectSchema.pre('remove', function (next) {
//     var subject = this;
//     subject.model('Category').update(
//         { subjects: {$in: subject._id}}, 
//         { $pull: { subject: subject._id } }, 
//         { multi: true }, 
//         next
//      );
// });

// subjectSchema.pre('remove', function(next) {
//     var subject = this;
//     subject.model('Category').update(
//         { subject: subject._id }, 
//         { $unset: { subject: 1 } }, 
//         { multi: true },
//         next);
// });

// subjectSchema.pre('remove', async function(next) {
//     const subject = this;
//     await Category.findOneAndUpdate(
//         {_id:}
//     )
//     next();
// })


module.exports = mongoose.model('Subject', subjectSchema);