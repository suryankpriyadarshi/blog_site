const mongoose = require('mongoose');
const env=require('dotenv');
env.config();
const uri = process.env.MONGODBURI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

function connectToDatabase() {
    mongoose.connect(uri, options)
        .then(() => console.log('Successfully connected to MongoDB'))
        .catch(err => console.error('Database connection error:', err));
}

const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  summary: String,
  body: String,
  date: { type: Date, default: Date.now },
  author: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
  },
});

const Author = mongoose.model('authors', authorSchema);
const Post = mongoose.model('posts', postSchema);

module.exports = {
    connectToDatabase,
    Author, 
    Post 
};
