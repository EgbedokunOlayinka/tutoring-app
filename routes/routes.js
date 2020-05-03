const router = require('express').Router();

const Category = require('../models/category');
const Subject = require('../models/subject');

const { verifyStudent, verifyTutor, verifyAdmin, verifyStudentAndAdmin, verifyGeneral } = require('../controllers/auth-verify');
const { studentSignup, studentLogin } = require('../controllers/auth-student');
const { tutorSignup, tutorLogin } = require('../controllers/auth-tutor');
const { createCategories, showCategories, showCategory, updateCategory, deleteCategory } = require('../controllers/auth-category');
const { createSubjects, showSubjects, showAllSubjects, showSubject, deleteSubject } = require('../controllers/auth-subject');

router.get('/', (req,res)=> {
    res.send('</h1>welcome page<h1>');
})

//GENERAL ROUTES
router.get('/categories', verifyGeneral, showCategories);
router.get('/categories/:id', verifyGeneral, showCategory);
router.get('/subjects', verifyGeneral, showAllSubjects);
router.get('/categories/:id/subjects/', verifyGeneral, showSubjects);
router.get('/categories/:id/subjects/:id', verifyGeneral, showSubject);
// router.get(search for subjects by name)
// router.get(search for tutors by first name)


// STUDENT ROUTES
router.post('/students/signup', studentSignup);
router.post('/students/login', studentLogin);
// router.post(book lesson)
// router.get(view all tutors taking a subject in a category)


//TUTOR ROUTES
router.post('/tutors/signup', tutorSignup);
router.post('/tutors/login', tutorLogin);
// router.post(register to teach subject in a category);
// router.get(view all the subject they registered to teach);
// router.put(update registered subject);
// router.delete(delete registered subject);

//ADMIN ROUTES
router.post('/categories',verifyAdmin, createCategories);
router.put('/categories/:id', verifyAdmin, updateCategory);
router.delete('/categories/:id', verifyAdmin, deleteCategory);
router.post('/categories/:id/subjects', verifyAdmin, createSubjects);
router.delete('/categories/:id/subjects/:id', verifyAdmin, deleteSubject);

module.exports = router;