const router = require('express').Router();

const { studentSignup, studentLogin } = require('../controllers/auth-student');
const { tutorSignup, tutorLogin } = require('../controllers/auth-tutor')

router.get('/', (req,res)=> {
    res.send('</h1>welcome page<h1>');
})

router.post('/students/signup', studentSignup);
router.post('/students/login', studentLogin);

router.post('/tutors/signup', tutorSignup);
router.post('/tutors/login', tutorLogin);


module.exports = router;