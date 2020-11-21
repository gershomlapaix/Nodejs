//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
//Creating a Router
var router = express.Router();
//Create Course model CLASS
const Course = mongoose.model('Course');
const Author = mongoose.model('Author')

const admin = require('../middlewares/admin')
const validate = require('./../models/course.model')
//Router Controller for CREATE request
router.post('/', admin, async (req, res) => {
    const {
        error
    } = validate(req.body)
    if (error) return res.send(error.details[0].message).status(400)
    let check = await checkAuthorExistence(req.body.authorId)
    console.log("--" + check)
    if (check) {
        try {
            insertIntoMongoDB(req, res);
        } catch (err) {
            return res.send(err)
        }
    } else {
        try {
            return res.send("Please use a valid author id !!").status(404)
        } catch (err) {
            return res.send(err)
        }
    }

});
//Router Controller for UPDATE request
router.put('/', admin, (req, res) => {
    const {
        error
    } = validate(req.body)
    if (error) return res.send(error.details[0].message).status(400)
    if (!checkCategoryExistence(req.body.authorId)) res.status(400).send("Please enter a valid authour id");
    updateIntoMongoDB(req, res);
});

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
    let course = new Course();
    course.courseName = req.body.courseName;
    course.authorId = req.body.authorId;
    course.save()
        .then(courseSaved => res.send(courseSaved).status(201))
        .catch(err => res.send(err).status(400));
}

//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
    Course.findOneAndUpdate({
        _id: req.body._id
    },
        req.body, {
        new: true
    })
        .then(course => res.send(course))
        .catch(err => res.send(err).status(400));
}
//Router to retrieve the complete list of available courses
router.get('/', (req, res) => {
    Course.find()
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});
router.get('/byname/:name/:couId', (req, res) => {
    Course.find({
        courseName: req.params.name,
        courseId: req.params.couId
    })
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});

router.get('/discount/:discount', (req, res) => {
    Course.find({
        discount: req.params.discount
    })
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
router.get('/comparision', (req, res) => {
    Course
        .find({
            discount: {
                $gte: 100
            }
        })
        //.find({discount:{$lte:100}})
        .sort({
            courseName: -1
        })
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});
//or
//and
router.get('/logical', (req, res) => {
    Course
        .find()
        //.and([{author:'Stanley'},{discount:{$in:[100,150]}}])
        .or([{
            discount: {
                $gte: 100
            }
        }, {
            author: 'Stanley'
        }])
        .sort({
            courseName: 1
        })
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});

router.get('/expression', (req, res) => {
    Course
        //starts with
        .find({
            author: /^sta/i
        })
        //ends with
        //.find({author:/Sta$/i})
        //contains
        //.find({author:/.*st.*/i})
        //.or([{author:'Stanley'},{discount:{$in:[100,150]}}])
        .and([{
            discount: {
                $gte: 100
            }
        }, {
            author: 'Stanley'
        }])
        .sort({
            courseName: 1
        })
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});
router.get('/advanced/:author', (req, res) => {
    Course.find({
        author: req.params.author
    })
        .select({
            author: 1,
            courseId: 1
        })
        .then(courses => res.send(courses))
        .catch(err => res.send(err).status(404));
});

router.get('/count/:author', (req, res) => {
    Course
        .find({
            author: req.params.author
        })
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

async function checkAuthorExistence(id) {
    return await Author.find({ _id: id })

}

//dispayCount('Stanley')
module.exports = router;

