const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Category = require('../models/category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
                message: 'Welcome to my channel'
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
            'secrettoken',
            {
                expiresIn: '1hr'
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




