//Import the dependencies
const express = require("express");
const mongoose = require("mongoose");
//Creating a Router
var router = express.Router();
//Create author model CLASS
const Author = mongoose.model("Author");
const validate = require("./../models/author.model");

//Router Controller for CREATE request
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);
  let author = await Author.findOne({ authorEmail: req.body.authorEmail });
  if (author != null) return res.send("User already registered").status(400);
  insertIntoMongoDB(req, res);
});

//Router Controller for UPDATE request
router.put("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);
  let author = Author.findOne({ authorEmail: req.body.authorEmail });
  if (!author) return res.send("User is not registered").status(400);
  updateIntoMongoDB(req, res);
});

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
  let author = new Author();
  author.authorName = req.body.authorName;
  author.authorId = req.body.authorId;
  author.authorEmail = req.body.authorEmail;
  author
    .save()
    .then((authorSaved) => res.send(authorSaved).status(201))
    .catch((err) => res.send(err).status(400));
}

//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
  Author.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    req.body,
    {
      new: true,
    }
  )
    .then((author) => res.send(author))
    .catch((err) => res.send(err).status(400));
}
//Router to retrieve the complete list of available authors
router.get("/", (req, res) => {
  Author.find()
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});
router.get("/byname/:name/:couId", (req, res) => {
  Author.find({
    authorName: req.params.name,
    authorId: req.params.couId,
  })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});

router.get("/discount/:discount", (req, res) => {
  Author.find({
    discount: req.params.discount,
  })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
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
router.get("/comparision", (req, res) => {
  Author.find({
    discount: {
      $gte: 100,
    },
  })
    //.find({discount:{$lte:100}})
    .sort({
      authorName: -1,
    })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});
//or
//and
router.get("/logical", (req, res) => {
  Author.find()
    .and([{ author: "Stanleym" }, { discount: { $in: [100, 150] } }])
    .or([
      {
        discount: {
          $gte: 100,
        },
      },
      {
        authorName: "Stanleym",
      },
    ])
    .sort({
      authorName: 1,
    })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});

router.get("/expression", (req, res) => {
  Author
    //starts with
    .find({
      author: /^sta/i,
    })
    //ends with
    //.find({author:/Sta$/i})
    //contains
    //.find({author:/.*st.*/i})
    //.or([{author:'Stanley'},{discount:{$in:[100,150]}}])
    .and([
      {
        discount: {
          $gte: 100,
        },
      },
      {
        author: "Stanley",
      },
    ])
    .sort({
      authorName: 1,
    })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});
router.get("/advanced/:author", (req, res) => {
  Author.find({
    author: req.params.author,
  })
    .select({
      author: 1,
      authorId: 1,
    })
    .then((authors) => res.send(authors))
    .catch((err) => res.send(err).status(404));
});

router.get("/count/:authors", (req, res) => {
  Author.find({
    author: req.params.authors,
  })
    .then((count) => res.send(count))
    .catch((err) => res.send(err));
});
//Router to update a author using it's ID
router.get("/:id", (req, res) => {
  Author.findById(req.params.id)
    .then((author) => res.send(author))
    .catch((err) => res.send(err).status(404));
});

//Router Controller for DELETE request
router.delete("/:id", (req, res) => {
  Author.findByIdAndRemove(req.params.id)
    .then((author) => res.send(author))
    .catch((err) => res.send(err).status(404));
});
//count documents
function dispayCount(author) {
  Author.find({
    author: author,
  })
    .countDocuments()
    .then((count) =>
      console.log({
        total: count,
      })
    )
    .catch((err) => console.error(err));
}

function checkCategoryExistence(id) {
  let authorSearch = Author.findById(id);
  if (authorSearch) return true;
  else return false;
}
//dispayCount('Stanley')
module.exports = router;
