const Category = require('../models/category');
const Subject = require('../models/subject');
const Tutor = require('../models/tutor');
const jwt = require('jsonwebtoken');


// exports.createSubjects = (req,res,next) => {
//     let categoryId = req.url.split('/')[2];
//     let { name } = req.body;

//     if(!name) {
//         return res.status(400).send('Subject name required');
//     }

//     Category.findOne({_id:categoryId})
//     .then((category)=>{
//         if(category) {
//             if(category.subjects.includes(name)===true) {
//                 res.status(423).send('Subject already exists in this category')
//             } else {
//                 let newSubject = new Subject({
//                     name: name
//                 })
//                 newSubject.save()
//                 .then((newSubject)=>{
//                     category.subjects.push(newSubject);
//                     category.save()
//                     .then(()=>{
//                         next();
//                     })
//                 })
//             }
//         } else {
//             res.status(404).send('Category not found')
//         }
//     })
// };

exports.createSubjects = (req,res,next) => {
    let categoryId = req.url.split('/')[2];
    let { name } = req.body;
    console.log(name);
    if(!name) {
        return res.status(400).send('Subject name required');
    }

    Category.findOne({_id:categoryId})
    .then((category)=>{
        if(category) {
            let subject = new Subject({
                name: name,
                category: category._id
            })
            subject.save()
            .then((subject)=>{
                category.subjects.push(subject);
                category.save()
                .then(()=>{
                    res.send('Subject created successfully');
                    console.log(category);
                })
            })
            .catch(err=>console.log(err));
        } else {
            res.status(404).send('Category not found')
        }
       
    })

}

exports.showSubjects = (req,res,next) => {
    let categoryId = req.url.split('/')[2];

    Category.findOne({_id:categoryId})
    .then((category)=> {
        if(!category) {
            res.status(404).send('Category not found');
        } else {
            Category.findOne({_id:categoryId})
            .populate('subjects', 'name category')
            .exec((err,subjects)=> {
                if(err) console.log(err)
                res.send(subjects);
            })
        }
    })
}

// exports.showAllSubjects = (req,res,next) => {
//     let query = req.query.search;
//     if(query) {
//         Subject.find({name: query}).collation({locale:'en',strength: 2}).sort({name:1})
//         .then(subjects=>{
//             res.send(subjects)
//         })
        
//     } else {
//         Category.find({})
//         .populate('subjects', 'name category')
//         .exec((err,subjects)=> {
//         res.send(subjects);
//         })
//     }
// }


exports.showAllSubjects = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const search = req.query.search;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }
            req.user = user;
            if(search) {
                Subject.find({name: search}).collation({locale:'en',strength: 2}).sort({name:1})
                .then(subjects=>{
                    res.send(subjects);
                })
            } else {
                Category.find({})
                .populate('subjects', 'name category')
                .exec((err,subjects)=> {
                res.send(subjects);
                })
            }
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }            
}



exports.showSubject = (req,res,next) => {
    let categoryId = req.url.split('/')[2];
    let subjectId = req.params.id;
    
    Category.findOne({_id:categoryId})
    .then((category)=> {
        if(!category) {
            res.status(404).send('Category not found');
        } else {
            Category.findOne({_id:categoryId})
            .populate('subjects', 'name category')
            .exec((err, subjects)=> {
                if(err) console.log(err);
                Subject.findOne({_id:subjectId})
                .then((subject)=>{
                    res.send(subject);
                })
                .catch(err=>console.log(err));
            })
        }
    })
}

exports.deleteSubject = (req,res,next) => {
    let categoryId = req.url.split('/')[2];
    let subjectId = req.params.id;

    Subject.findById(subjectId)
    .then((subject)=>{
        if(!subject) {
            res.status(404).send('Subject not found')
        }else {
            subject.remove((err)=>{
                if(!err) {
                    Category.update(
                        {_id: subject.category},
                        {$pull: {subjects: subject._id}},
                        function(err, numberAffected) {
                            console.log(numberAffected.n);

                            Tutor.find({subjects:{"$in":[subjectId]}})
                            .then(tutors=>{
                                for(let i in tutors) {
                                    Tutor.update(
                                        {_id: tutors[i]._id},
                                        {$pull: {subjects: subject._id}},
                                        function(err, numberAffected) {
                                            console.log(numberAffected.n);
                                        }
                                    )
                                }
                                res.status(204).send('Subjected deleted successfully')
                            })
                        }
                        )
                    
                } else {
                    console.log(err);
                }
            })
        }
        
    })
}

exports.updateSubject = (req,res,next) => {
    let { name } = req.body;
    let categoryId = req.url.split('/')[2];
    let subjectId = req.params.id;

    Category.findOne({_id:categoryId})
    .then((category)=> {
        if(!category) {
            res.status(404).send('Category not found');
        } else {
            Category.findOne({_id:categoryId})
            .populate('subjects', 'name category')
            .exec((err, subjects)=> {
                if(err) console.log(err);
                Subject.findByIdAndUpdate(subjectId, {name:name})
                .then((subject)=>{
                    res.send('Subject updated successfully');
                })
                .catch(err=>console.log(err))
            })
        }
    })
}

exports.viewSubjectTutors = (req,res,next) => {
    let categoryId = req.url.split('/')[2];
    let subjectId = req.url.split('/')[4];

    Category.findById(categoryId)
    .then(category=>{
        if(!category) {
            res.status(404).send('Category not found');
        } else {
            Subject.findById(subjectId)
            .then(subject=>{
                if(!subject) {
                    res.status(404).send('Subject not found')
                } else {
                    Subject.findById(subjectId)
                    .populate('tutors', 'name email')
                    .exec((err,tutors)=>{
                        if(err) console.log(err)
                        res.send(tutors);
                        
                    })
                }
            })
        }
    })
}



