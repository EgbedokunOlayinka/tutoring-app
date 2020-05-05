const router = require('express').Router();

const Category = require('../models/category');
const Subject = require('../models/subject');

const { verifyStudent, verifyTutor, verifyAdmin, verifyStudentAndAdmin, verifyGeneral, verifyRegisteredTutor } = require('../controllers/auth-verify');
const { studentSignup, studentLogin } = require('../controllers/auth-student');
const { tutorSignup, tutorLogin, showTutors, showTutor, registerTutor, viewTutorSubjects } = require('../controllers/auth-tutor');
const { createCategories, showCategories, showCategory, updateCategory, deleteCategory } = require('../controllers/auth-category');
const { createSubjects, showSubjects, showAllSubjects, showSubject, deleteSubject , updateSubject, viewSubjectTutors} = require('../controllers/auth-subject');
const { bookLesson, viewLessons, viewLesson, updateLesson, deleteLesson } = require('../controllers/auth-lesson');
router.get('/', (req,res)=> {
    res.send('</h1>welcome page<h1>');
})

//GENERAL ROUTES
router.get('/categories', verifyGeneral, showCategories);
router.get('/categories/:id', verifyGeneral, showCategory);
router.get('/subjects', verifyGeneral, showAllSubjects);
router.get('/categories/:id/subjects/', verifyGeneral, showSubjects);
router.get('/categories/:id/subjects/:id', verifyGeneral, showSubject);
// router.get('/subjects?search={name}', verifyGeneral, searchSubjects);
// router.get(search for tutors by first name)


// STUDENT ROUTES
router.post('/students/signup', studentSignup);
router.post('/students/login', studentLogin);
router.get('/categories/:id/subjects/:id/tutors', verifyStudent, viewSubjectTutors);




//TUTOR ROUTES
router.post('/tutors/signup', tutorSignup);
router.post('/tutors/login', tutorLogin);
router.post('/categories/:id/subjects/:id/tutors', verifyTutor, registerTutor );
router.get('/tutors/:id/subjects', verifyTutor, viewTutorSubjects);


//ADMIN ROUTES
router.post('/categories',verifyAdmin, createCategories);
router.put('/categories/:id', verifyAdmin, updateCategory);
router.delete('/categories/:id', verifyAdmin, deleteCategory);
router.post('/categories/:id/subjects', verifyAdmin, createSubjects);
router.get('/tutors', verifyAdmin, showTutors);
router.get('/tutors/:id', verifyAdmin, showTutor);
router.get('/lessons', verifyAdmin, viewLessons);
router.get('/lessons/:id', verifyAdmin, viewLesson);
router.put('/lessons/:id', verifyAdmin, updateLesson);
router.delete('/lessons/:id', verifyAdmin, deleteLesson);

//ADMIN AND REGISTERED TUTOR ROUTES
router.put('/categories/:id/subjects/:id', verifyRegisteredTutor, updateSubject);
router.delete('/categories/:id/subjects/:id', verifyRegisteredTutor, deleteSubject);

//ADMIN AND STUDENT ROUTES
router.post('/lessons', verifyStudentAndAdmin, bookLesson)


module.exports = router;