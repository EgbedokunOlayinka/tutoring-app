const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Subject = require('../models/subject');
const Lesson = require('../models/lesson');


exports.bookLesson = (req,res,next) => {
    const { tutor_id, student_id, subject_id } = req.body;

    if(!tutor_id||!student_id||!subject_id) {
        res.status(400).send('All fields required')
    } else {
        Tutor.find({subjects:{"$in":[subject_id]}})
        .then(tutors=>{
            if(!tutors) {
                res.status(403).send('Tutor does not teach this subject')
            } else {
                Tutor.findById(tutor_id)
                .then(tutor=>{
                    if(!tutor) {
                        res.status(404).send('Tutor does not teach subject or does not exist. Please check the tutor details provided')
                    } else {
                        Student.findById(student_id)
                        .then(student=>{
                            if(!student){
                                res.status(404).send('Tutor not found')
                            } else {
                                Subject.findById(subject_id)
                                .then(subject=>{
                                    if(!subject) {
                                        res.status(404).send('Subject not found')
                                    } else {
                                        let lesson = new Lesson({
                                            tutor_id: tutor._id,
                                            student_id: student._id,
                                            subject_id: subject._id
                                        })
                                        lesson.save()
                                        .then(lesson=>{
                                            tutor.lessons.push(lesson)
                                            tutor.save()
                                            .then(()=>{
                                                student.lessons.push(lesson)
                                                student.save()
                                                .then(()=>{
                                                    res.status(201).send('Lesson booked successfully')
                                                })
                                                .catch(err=>console.log(err));
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                
            }
        }
            
        )
    }

}


exports.viewLessons = (req,res,next) => {
    Lesson.find({})
    .then(lessons=>{
        res.send(lessons);
    })
}

exports.viewLesson = (req,res,next) => {
    const id = req.params.id;

    Lesson.findById(id)
    .then(lesson=>{
        if(!lesson) {
            res.status(404).send('Lesson not found');
        } else {
            res.send(lesson);
        }
    })
}

exports.updateLesson = (req,res,next) => {
    const { tutor_id } = req.body;
    const lesson_id = req.params.id;
    //console.log(tutor_id, lesson_id);

    if(!tutor_id) {
        res.status(400).send('New tutor id needed');
    } else {
        Lesson.findById(lesson_id)
        .then(lesson=>{
            Subject.findById(lesson.subject_id)
            .then(subject=>{
                if(subject.tutors.includes(tutor_id)==false) {
                    res.status(404).send('Tutor does not teach this subject');
                } else {
                    Lesson.findByIdAndUpdate(lesson_id, {tutor_id: tutor_id})
                    .then(lesson=>{
                        Tutor.find({lessons:{"$in":[lesson_id]}})
                        .then(tutors=>{
                            for(let i in tutors) {
                                Tutor.update(
                                    {_id: tutors[i]._id},
                                    {$pull: {lessons: lesson_id}},
                                    function(err, numberAffected) {
                                        console.log(numberAffected.n);
                                        Tutor.findById(tutor_id)
                                        .then(tutor=>{
                                            tutor.lessons.push(lesson_id)
                                            tutor.save()
                                            .then(()=>{
                                                res.status(200).send('Lesson updated successfully');
                                            })
                                        })
                                    }
                                )
                            }
                        })
                    })
                }
            })
        })
    }

}


exports.deleteLesson = (req,res,next) => {
    const lesson_id = req.params.id;

    Lesson.findById(lesson_id)
    .then(lesson=>{
        if(!lesson){
            res.status(404).send('Lesson not found')
        } else {
            lesson.remove((err)=>{
                if(!err) {
                    Tutor.update(
                        {_id:lesson.tutor_id},
                        {$pull: {lessons: lesson._id}},
                        function(err,numberAffected) {
                            if(err) console.log(err)
                            console.log(numberAffected.n)

                            Student.update(
                                {_id:lesson.student_id},
                                {$pull: {lessons: lesson._id}},
                                function(err,numberAffected) {
                                    if(err) console.log(err)
                                    console.log(numberAffected.n)
                                    res.status(204).send('Lesson deleted successfully');
                                }
                            )
                        }
                    )
                } else {
                    console.log(err);
                }
            })
            
        }
    })
}
