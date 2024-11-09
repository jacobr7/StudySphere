const express = require('express');
const cors = require('cors'); // Import cors
const multer = require('multer')
require('dotenv').config();
const mongoose = require('./db'); // Import the MongoDB connection
const FileModel = require('./models/FileModel'); // Import the Note model
const axios = require('axios'); // Make sure axios is imported

const admin = require("firebase-admin");//Import firebase admin SDK
// const serviceAccount = require("./config/firebase-admin.json"); // Import the service account key
const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri":  process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
  "universe_domain": "googleapis.com"
}


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

//Middleware to verify firebase tokens(Have not test)
//req header need to have token(need to set frontend to send this)
//Just use req.userId to get user
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
      return res.status(403).send('A token is required for authentication');
  }

  try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid; // Attach user ID to the request object
      next();
  } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send('Invalid Token');
  }
};

//EndPoints

  // Test route to check if backend works
  app.get('/ping', (req, res) => {
    res.send('Backend is working!');
  });

  //FlashCard
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

//NoteSharing
//This is to retrieve all notes
app.get('/files', async (req, res) => {
  try {
    const files = await FileModel.find(); // Retrieve all files from MongoDB
    res.status(200).json(files); // Send the files as a JSON response
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'Failed to retrieve files.' });
  }
});

//This is to download files

app.get('/download/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  
  try {
    // Find the file document in MongoDB using the fileId
    const file = await FileModel.findById(fileId);  // Use the correct model name for your files

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Get the file URL from the document
    const fileUrl = file.url; // Assuming the file URL is stored in the `url` field of the document

    // Send a GET request to Firebase Storage to retrieve the file
    const response = await axios.get(fileUrl, { responseType: 'stream' });

    // Set the Content-Disposition header to force the download
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`); // Use file.filename to suggest filename

    // Pipe the file stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});

//This is to delete files
//req needs fileId
app.delete('/files', async (req, res) => {
  const { fileId } = req.body;

  console.log('Received fileId:', fileId);  // Log the received fileId

  // Validate fileId
  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required.' });
  }

  try {
    // Find the file by ID in MongoDB
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found in database.' });
    }

    // Delete the file from Firebase Storage by Name
    const fileRef = bucket.file(file.filename);
    await fileRef.delete();

    // Delete the file from MongoDB by Id
    await FileModel.findByIdAndDelete(fileId);

    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});


// Endpoint to get unique course codes
app.get('/api/unique-course-codes', async (req, res) => {
  try {
    const uniqueCourseCodes = await FileModel.aggregate([
      { $group: { _id: "$courseCode" } }, // Group by courseCode
      { $sort: { _id: 1 } } // Optional: sort alphabetically
    ]);

    const courseCodes = uniqueCourseCodes.map(item => item._id);

    res.json(courseCodes);
  } catch (error) {
    console.error("Error retrieving course codes:", error);
    res.status(500).json({ error: "Failed to retrieve course codes" });
  }
});

//This is to retrieve notes of a certain person
//req need userId which should be taken from middleware
app.get('/files/user-notes', verifyFirebaseToken, async (req, res) => {
  const userId = req.userId; // Get the user ID from the request object

  try {
      const files = await FileModel.find({ userId }); // Query notes for the user ID
      res.status(200).json(files); // Respond with the user's notes
  } catch (error) {
      console.error('Error retrieving user files:', error);
      res.status(500).json({ error: 'Failed to retrieve files.' });
  }
});


//This is the updated uploading of file 
//req need file, filename(extract from file), courseCode, userId from middleware
app.post('/upload', verifyFirebaseToken, upload.single('file'), async (req, res) => {

  const { courseCode } = req.body//this is basically courseCode = req.body.courseCode

  //upload.single('file') finds a form field in html with the name 'file'
  //When uploaded successfully, multer will add file details to req object which can be access for file information
  try{
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
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;

    //Save Url to MongoDB
    const newFile = new FileModel({
      filename: req.file.originalname,
      url: publicUrl,
      userId: req.userId,
      courseCode: courseCode
    })
    //Wait for file to be saved into mongodb
    const savedFile = await newFile.save();

    // Optional: Make the file publicly accessible
    await blob.makePublic();

    res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
  });

  blobStream.end(req.file.buffer);
} catch(error) {
  console.log('Upload endpoint error:', error);
  res.status(500).json({ error: 'An error occurred during upload.' });
}
})




// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
