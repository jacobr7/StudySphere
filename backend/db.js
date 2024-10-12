require('dotenv').config();
const mongoose = require('mongoose');
//Store Password in .env and use gitignore in .env to prevent others from seeing password
const DBPASSWORD = process.env.MONGODBPW;

// Replace with your MongoDB connection string
const MONGODB_URI = `mongodb+srv://Nickyking:${DBPASSWORD}@cluster0.hv6jw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to the MongoDB database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;