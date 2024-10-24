const mongoose = require('mongoose');

// Define the schema for flashcard folders
const FlashcardFolderSchema = new mongoose.Schema({
  name: String,
  userId: String, // The Firebase UID of the user who owns the folder
  flashcardCount: Number, // Optional: Track how many flashcards are in the folder
});

// Create the model
const FlashcardFolder = mongoose.model('FlashcardFolder', FlashcardFolderSchema);

module.exports = FlashcardFolder;
