const router = require('express').Router();

const { verifyStudent, verifyTutor, verifyAdmin, verifyStudentAndAdmin } = require('../controllers/auth-verify');
const { studentSignup, studentLogin } = require('../controllers/auth-student');
const { tutorSignup, tutorLogin } = require('../controllers/auth-tutor');
const { createCategories, showCategories } = require('../controllers/auth-category');

router.get('/', (req,res)=> {
    res.send('</h1>welcome page<h1>');
})


// STUDENT ROUTES
router.post('/students/signup', studentSignup);
router.post('/students/login', studentLogin);


//TUTOR ROUTES
router.post('/tutors/signup', tutorSignup);
router.post('/tutors/login', tutorLogin);

//CATEGORY ROUTES
router.post('/categories', createCategories);
router.get('/categories', verifyStudentAndAdmin, showCategories);



module.exports = router;