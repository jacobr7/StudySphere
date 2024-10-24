const express = require('express');
const cors = require('cors'); // Import cors
const multer = require('multer')
const mongoose = require('./db'); // Import the MongoDB connection
const Note = require('./models/Note'); // Import the Note model

const admin = require("firebase-admin");//Import firebase admin SDK
const serviceAccount = require("./config/firebase-admin.json"); // Import the service account key

const app = express();
const PORT = 5000;

const upload = multer({ storage: multer.memoryStorage() }); //Create an instance of multer
//Store in ram, if its multer.diskStorage() = store in disk

// Use cors middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request bodies


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://studysphere-8f8ae.appspot.com" // Replace with your actual bucket name
});


// Example of using storage or authentication
const bucket = admin.storage().bucket();
module.exports = { admin, bucket }; //Export admin and bucket so they can be used in other parts of application (Share Functionality)

//EndPoints

  // Test route to check if backend works
  app.get('/ping', (req, res) => {
    res.send('Backend is working!');
  });

  // Route to get all notes from the database
  app.get('/notes', async (req, res) => {
    try {
      const notes = await Note.find(); // Retrieve all notes from MongoDB
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving notes' });
    }
  });

  // Route to add a new note to the database
  app.post('/notes', async (req, res) => {
    try {
      const newNote = new Note(req.body); // Create a new note using the model
      const savedNote = await newNote.save(); // Save the note to MongoDB
      res.status(201).json(savedNote);
    } catch (error) {
      res.status(500).json({ message: 'Error adding note' });
    }
  });

  // New Route to get flashcard folders based on the logged-in user
  app.get('/api/flashcardfolders', async (req, res) => {
    const userId = req.query.userId;  // Get userId from the query params
  
    try {
      const folders = await FlashcardFolder.find({ userId: userId }); // Retrieve flashcard folders from MongoDB
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });


// Route to add flashcard
app.post('/api/flashcards', async (req, res) => {
  const { folderId, question, answer } = req.body; // Get the folder ID and flashcard data from the request body

  try {
    // Find the folder by ID
    const folder = await FlashcardFolder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Add the new flashcard to the folder's flashcards array
    folder.flashcards.push({ question, answer });

    // Save the updated folder
    await folder.save();

    res.status(201).json(folder); // Return the updated folder with the new flashcard
  } catch (error) {
    res.status(500).json({ error: 'Failed to add flashcard' });
  }
});

  // Route to create a new forum topic
app.post('/api/topics', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTopic = new ForumTopic({ title, description });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Route to fetch all forum topics
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await ForumTopic.find().sort({ created_at: -1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Route to add a post (reply) to a topic
app.post('/api/topics/:id/posts', async (req, res) => {
  try {
    const { username, content } = req.body;
    const topic = await ForumTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const newPost = { username, content };
    topic.posts.push(newPost);
    await topic.save();

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add post' });
  }
});



  app.post('/upload', upload.single('file'), async (req, res) => {
    //upload.single('file') finds a form field in html with the name 'file'
    //When uploaded successfully, multer will add file details to req object which can be access for file information
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({ //Create a writable stream that write data to blob in firebase storage
      resumable: false, // Whether the upload is resumable or not
      contentType: req.file.mimetype,
    });
  
    blobStream.on('error', (err) => { //Listen for events in this case when upload fails
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file.');
    });
  
    blobStream.on('finish', async () => { //Listen for events in this case when finish uploading
      // Get the download URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
  
      // Optional: Make the file publicly accessible
      //await blob.makePublic();
  
      res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
    });
  
    blobStream.end(req.file.buffer);
  });



// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
