const mongoose = require('mongoose');

// Define the schema for a post (reply) inside a topic
const postSchema = new mongoose.Schema({
  username: String, // User who posted the reply
  content: String,  // The content of the post/reply
  created_at: { type: Date, default: Date.now }
});

// Define the schema for a forum topic
const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Title of the topic
  description: { type: String, required: true },  // Short description of the topic
  created_at: { type: Date, default: Date.now },  // When the topic was created
  posts: [postSchema]  // Array of posts (replies)
});

// Create the Topic model
const ForumTopic = mongoose.model('ForumTopic', topicSchema);

module.exports = ForumTopic;
