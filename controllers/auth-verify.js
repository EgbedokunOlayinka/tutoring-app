const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Category = require('../models/category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.verifyTutor = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            console.log(user);
            if(user.role==='tutor'){
                next();
            } else {
                res.status(401).send('You do not possess sufficient authorization to view this page')
            }
            
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }              
};

exports.verifyStudent = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            console.log(user);
            if(user.role==='student'){
                next();
            } else {
                res.status(401).send('You do not possess sufficient authorization to view this page')
            }
            
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }              
};

exports.verifyAdmin = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            console.log(user);
            if(user.role==='tutor' && user.adminstatus===true){
                next();
            } else {
                res.status(401).send('You do not possess sufficient authorization to view this page')
            }
            
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }              
};

exports.verifyStudentAndAdmin = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            console.log(user);
            if((user.role==='tutor' && user.adminstatus===true)||user.role==='student'){
                next();
            } else {
                res.status(401).send('You do not possess sufficient authorization to view this page')
            }
            
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }              
};

exports.verifyGeneral = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            next();
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }              
};

exports.verifyRegisteredTutor = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const subjectId = req.params.id;
    let item;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(403)
                .send('Incorrect token')
            }

            req.user = user;
            console.log(user);

            Subject.findById(subjectId)
            .then(subject=>{
                if(!subject){
                    res.status(404).send('Subject not found')
                } else {
                    if(subject.tutors.includes(user._id)||(user.role==='tutor' && user.adminstatus===true)) {
                        next();
                    } else {
                        res.status(401).send('You do not possess sufficient authorization to view this page')
                    }
                }
            })
         
        });
    } else {
        res
        .status(401)
        .send('You are not authenticated to view this page');
    }            
}

