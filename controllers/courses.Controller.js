//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
//Creating a Router
var router = express.Router();
//Create Course model CLASS
const Course = mongoose.model('Course');
 
//Router Controller for CREATE request
router.post('/', (req,res) => {
insertIntoMongoDB(req, res);
});
 //Router Controller for UPDATE request
router.put('/', (req,res) => {
    updateIntoMongoDB(req, res);
});
     
//Creating function to insert data into MongoDB
function insertIntoMongoDB(req,res) {
var course = new Course();
course.courseName = req.body.courseName;
course.courseId = req.body.courseId;
course.courseNameId = req.body.courseNameId;
course.save()
    .then(courseSaved => res.send(courseSaved).status(201))
    .catch(err => res.send(err).status(400));
}
 
//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
Course.findOneAndUpdate({ _id: req.body._id },
     req.body, { new: true })
    .then(course => res.send(course))
    .catch(err => res.send(err).status(400));
} 
//Router to retrieve the complete list of available courses
router.get('/', (req,res) => {
Course.find()
    .then(courses => res.send(courses))
    .catch(err => res.send(err).status(404));
});
//Comparision operators
// eq (equal)
//ne (not equal)
//gt (greater than)
//gte (greater than or equal to)
//lt (less than)
//lte (Less than or equal to)
//in
//nin (not in)
router.get('/comparision', (req,res) => {
    Course
    //.find({courseId:{$gt: 100}})
    .find({courseId:{$in: [1,3,2]}})
    .sort({courseName:1})
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
    });
    //or
    //and
    router.get('/logical', (req,res) => {
        Course
        .find()
        //.or([{courseName:'Javascript'},{courseId:{$in:[100,150]}}])
        .and([{courseId:{$gte:100}},{courseName:'Javascript'}])
        .sort({courseName:1})
            .then(courses => res.send(courses))
            .catch(err => res.send(err).status(404));
        });
        
        router.get('/expressions', (req,res) => {
            Course
            //starts with
            .find({ courseName: /^java/i})
            //ends with
            //.find({courseName:/Sta$/i})
            //contains
           //.find({courseName:/.*st.*/i})
            //.or([{courseName:'Javascript'},{courseId:{$in:[100,150]}}])
            .and([{courseId:{$gte:100}},{courseName:'Javascript'}])
            .sort({courseName:1})
                .then(courses => res.send(courses))
                .catch(err => res.send(err).status(404));
            });
router.get('/advanced/:courseName', (req,res) => {
    Course.find({courseName: req.params.courseName})
    .select({courseName:1,courseId:1})
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
    });
    
router.get('/count/:courseName', (req,res) => {
    Course
    .find({courseName: req.params.courseName})
            .then(count => res.send(count))
            .catch(err => res.send(err));

    });
//Router to update a course using it's ID
router.get('/:id', (req, res) => {
Course.findById(req.params.id)
    .then(course => res.send(course))
    .catch(err => res.send(err).status(404));
});
 
//Router Controller for DELETE request
router.delete('/:id', (req, res) => {
Course.findByIdAndRemove(req.params.id)
    .then(course => res.send(course))
    .catch(err => res.send(err).status(404));
});
//count documents
function dispayCount(courseName){
Course.find({courseName:courseName}).countDocuments()
    .then(count =>console.log({total:count }))
    .catch(err => console.error(err));
}
//dispayCount('Javascript')
module.exports = router;