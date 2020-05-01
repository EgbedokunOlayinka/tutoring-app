const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Category = require('../models/category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secrettoken', (err,user) => {
            if(err) {
                res
                .status(401)
                .send('Incorrect token')
            }
            
            req.user = user;
            next();
        });
    } else {
        res
        .status(401)
        .send('You are not aunthenticated to view this page');
    }

};