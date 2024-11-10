const mongoose = require('mongoose');

// Define the schema for flashcard folders
const FlashcardFolderSchema = new mongoose.Schema({
  name: String,  // Folder name
  userId: String, // Firebase UID of the folder owner
  flashcards: [
    {
      question: String,
      answer: String
    }
  ], // Array of flashcards (question and answer)
});

const FlashcardFolder = mongoose.model('FlashcardFolder', FlashcardFolderSchema);

module.exports = FlashcardFolder;

