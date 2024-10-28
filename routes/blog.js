const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDatabase,Author, Post } = require("../data/database.js"); // Import the models

const router = express.Router();

connectToDatabase();

router.get("/", (req, res, next) => {
  try {
    res.redirect("/posts");
  } catch (err) {
    next(err);
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    // Use Mongoose model to fetch posts
    const posts = await Post.find({}, { title: 1, summary: 1, "author.name": 1 });
    res.render("posts-list", { posts: posts });
  } catch (err) {
    next(err);
  }
});

router.get("/new-post", async (req, res, next) => {
  try {
    // Fetch authors using the Author model
    const authors = await Author.find({});
    console.log(authors);
    res.render("create-post", { authors: authors });
  } catch (err) {
    next(err);
  }
});

router.post("/posts", async (req, res, next) => {
  try {
    const author = await Author.findById(req.body.author);
    
    const newPost = new Post({
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.content,
      author: {
        id: author._id,
        name: author.name,
        email: author.email,
      },
    });
    
    const result = await newPost.save();
    console.log(result);
    res.redirect("/posts");
  } catch (err) {
    next(err);
  }
});

router.get("/posts/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select('-summary');

    if (!post) {
      return res.status(404).render("404");
    }

    post.humanReadableDate = post.date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    post.date = post.date.toISOString();

    res.render("post-detail", { post: post });
  } catch (err) {
    next(err);
  }
});

router.get("/posts/:id/edit", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select("title summary body");

    if (!post) {
      return res.status(404).render("404");
    }

    res.render("update-post", { post: post });
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id/edit", async (req, res, next) => {
  try {
    const result = await Post.updateOne({ _id: req.params.id }, {
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.content,
    });
    res.redirect('/posts');
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id/delete", async (req, res, next) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    res.redirect('/posts');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
