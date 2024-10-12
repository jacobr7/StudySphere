const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('./db'); // Import the MongoDB connection
const Note = require('./models/Note'); // Import the Note model

const app = express();
const PORT = 5000;

// Use cors middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request bodies

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

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});