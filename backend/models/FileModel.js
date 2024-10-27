const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
});
//Havent test
// const fileSchema = new mongoose.Schema({
//   filename: {
//       type: String,
//       required: true, // Ensure the filename is required
//   },
//   url: {
//       type: String,
//       required: true, // Ensure the URL is required
//   },
//   userId: {
//       type: String,
//       required: true, // Ensure the userId is required
//   },
//   courseCode: {
//       type: String,
//       required: true, // Ensure the courseCode is required
//   },
//   createdAt: {
//       type: Date,
//       default: Date.now, // Automatically set the date when the file is created
//   },
// });

module.exports = mongoose.model('File', fileSchema);// File is the Collection, fileschema is the structure of the collection



//Example to create document

    // const newFile = new FileModel({
    //   filename: req.file.originalname,
    //   url: publicUrl
    // })

    // Wait for file to be saved into mongodb
    
    // const savedFile = await newFile.save();