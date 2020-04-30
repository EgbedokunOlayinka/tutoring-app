const router = require('express').Router();

const {studentSignup} = require('../controllers/auth-student');

router.get('/', (req,res)=> {
    res.send('</h1>welcome page<h1>');
})

router.post('/students/signup', studentSignup);


module.exports = router;