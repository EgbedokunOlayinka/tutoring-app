const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Category = require('../models/category');
const Lesson = require('../models/lesson');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { verifyGeneral, verifyAdmin } = require('../controllers/auth-verify');


exports.tutorSignup = (req,res,next) => {
    const { firstname, lastname, email, password, experience } = req.body;
    

    if(!firstname || !lastname || !email || !password || !experience) {
            res
            .status(400)
            .send({
                status: false,
                message: 'All fields required'
            })
        
    }

    Tutor.findOne({email})
    .then(tutor => {
        if(tutor) {
           return res
            .status(423)
            .send({
                status: false,
                message: 'Email already exists'
            })
        }

        bcrypt.hash(password, 12)
        .then(password => {
        let tutor = new Tutor({
            firstname, lastname, email, password, experience
        })

        if(tutor.experience>=3) {
            tutor.adminstatus = true;
        }

        return tutor.save()
    })

        .then(() => {
            res
            .status(200)
            .send({
                status: true,
                message: 'Welcome to the online tutoring system'
            })
        })
        .catch((err) => {
            console.log(err)
        })
        })

};

exports.tutorLogin = (req,res,next) => {
    const { email, password } = req.body;

    Tutor.findOne({email})
    .then(tutor => {
        if(!tutor) {
            res
            .status(403)
            .send('User not found. Please provide valid details')
        }

        bcrypt.compare(password, tutor.password)
        .then(valid => {
            if(!valid) {
                res
                .status(403)
                .send('Incorrect username or password')
            }

            const token = jwt.sign({
                email: tutor.email, _id: tutor._id, role: tutor.role, adminstatus: tutor.adminstatus
            },
            process.env.SECRET ,
            {
                expiresIn: '12hr'
            })

            res
            .status(200)
            .send({
                _id: tutor._id,
                token
            });
        });
        
    })
    .catch(err => console.log(err));
}


exports.showTutors = (req,res,next) => {
    const search = req.query.search;
    const authHeader = req.headers.authorization;
    // const sorted = req.query.sort;
    console.log(search);

    if(authHeader) {
        if(search) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.SECRET , (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }
            req.user = user;
            Tutor.find({firstname: search}).collation({locale:'en',strength: 2}).sort({firstname:1})
            .then(tutors=>{
            res.send(tutors);
                })
            });
        } else {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.SECRET , (err,user) => {
                if(err) {
                    res
                    .status(403)
                    .send('Incorrect token')
                }
    
                req.user = user;
                console.log(user);
                if(user.role==='tutor' && user.adminstatus===true){
                    Tutor.find({})
                    .then(tutors=>{
                        res.send(tutors);
                    })
                } else {
                    res.status(401).send('You do not possess sufficient authorization to view this page')
                }
                
            });
        }
    } else {
        res.status(401).send('You are not authenticated to view this page')
    }

}


exports.showTutor = (req,res,next) => {
    Tutor.findById(req.params.id)
    .then(tutor=>{
        if(!tutor) {
            res.status(404).send('Tutor not found')
        } else {
            res.send(tutor);
        }
    })
}

exports.registerTutor = (req,res,next) => {
    const categoryId = req.url.split('/')[2];
    const subjectId = req.url.split('/')[4];
    const { email } = req.body;

    if(!email) {
        res.status(400).send('Email field required')
    } else {
        Category.findById(categoryId)
        .then(category=>{
        if(!category) {
            return res.status(404).send('Category not found');
        } else {
            Subject.findById(subjectId)
            .then(subject=>{
                if(!subject) {
                    return res.status(404).send('Status not found');
                } else {
                    Tutor.findOne({email:email})
                    .then(tutor=>{
                        tutor.subjects.push(subject);
                        tutor.save()
                        .then(tutor=>{
                        subject.tutors.push(tutor);
                        subject.save()
                        .then(()=>{
                            res.status(201).send('Tutor registered successfully')
                        })
                        .catch(err=>console.log(err))
                        })
                    })
                }
            })
        }
    })
    }
}

exports.viewTutorSubjects = (req,res,next) => {
    let tutorId = req.url.split('/')[2];
    
    Tutor.findById(tutorId)
    .populate('subjects', 'name category')
    .exec((err,subjects)=>{
        if(err) console.log(err);
        res.send(subjects);
    })
}

exports.deleteTutor = (req,res,next) => {
    let tutorId = req.params.id;
    console.log(tutorId)

    Tutor.findById(tutorId)
    .then(tutor=>{
        if(!tutor) {
            res.status(404).send('Tutor not found');
        } else {
            tutor.remove((err)=>{
                if(!err){
                    Lesson.deleteMany({tutor_id: tutorId})
                    .then(lesson=>{
                        Subject.find({tutors:{"$in":[tutorId]}})
                        .then(subjects=>{
                            for(let i in subjects) {
                                Subject.update(
                                    {_id: subjects[i]._id},
                                    {$pull: {tutors: tutorId}},
                                    function(err, numberAffected) {
                                        if(err) console.log(err)
                                        console.log(numberAffected.n);
                                    }
                                )
                            }
                        })
                        res.status(204).send('Tutor deactivated successfully');
                    })
                } else {
                    console.log(err);
                }
            })
        }
    })

}








