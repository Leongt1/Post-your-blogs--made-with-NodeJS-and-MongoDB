const express = require("express");
const mongodb = require("mongodb");
const { getDb } = require("../data/database");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", function (req, res) {
	res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
	// we can filter the returned data, find() takes in two patameters objects:
	// the 1st object specifies the data to return - if left blank returns all the data in that collections
	// the 2nd object is used to specify what data is to be displayed - 1 to include; 2 to exclude - the _id field is fetched regardless
	const posts = await db
		.getDb()
		.collection("posts")
		// .find({}, { title: 1, summary: 1, "author.name": 1 })
		// OR
		// recommended way to do the above in NodeJS
		.find({})
		.project({ title: 1, summary: 1, "author.name": 1 })
		.toArray();

	res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
	const authors = await db.getDb().collection("authors").find().toArray(); //accessing to 'authors' collection
	// console.log(authors);
	res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
	// console.log(req.body.author); //contains the id of the author
	var authorId = new ObjectId(req.body.author);
	const author = await db
		.getDb()
		.collection("authors")
		.findOne({ _id: authorId });

	const newPost = {
		title: req.body.title,
		summary: req.body.summary,
		body: req.body.content,
		date: new Date(),
		author: {
			id: authorId,
			name: author.name,
			email: author.email,
		},
	};

	const result = await db.getDb().collection("posts").insertOne(newPost);
	console.log(result);
	res.redirect("/posts");
});

router.get("/posts/:id", async (req, res) => {
	const postId = req.params.id; // this gets the id part from the URL
	const post = await db
		.getDb()
		.collection("posts")
		.findOne({ _id: new ObjectId(postId) }, { summary: 0 })

  if(!post) {
    return res.status(404).render('404');
  } 

  // creating a property in post for date in a readable format
  post.humanReadableDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  post.date = post.date.toISOString();

	res.render("post-detail", { post: post });
});

module.exports = router;
