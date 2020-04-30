const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Category = require('../models/category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.studentSignup = (req,res,next) => {
    const { firstname, lastname, email, password} = req.body;
    

    if(!firstname || !lastname || !email || !password) {
            res
            .status(400)
            .send({
                status: false,
                message: 'All fields required'
            })
        
    }

    Student.findOne({email})
    .then(student => {
        if(student) {
            res
            .status(423)
            .send({
                status: false,
                message: 'Email already exists'
            })
        }
    })

    
    bcrypt.hash(password, 12)
    .then(password => {
        let student = new Student({
            firstname, lastname, email, password
        })

        return student.save()
    })

    .then(() => {
        res
        .status(200)
        .send({
            status: true,
            message: 'Welcome to my channel'
        })
    })
    .catch((err) => {
        console.log(err)
    })

};

exports.studentLogin = (req,res,next) => {

}


