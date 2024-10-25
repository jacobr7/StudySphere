const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model('File', fileSchema);// File is the Collection, fileschema is the structure of the collection



//Example to create document

    // const newFile = new FileModel({
    //   filename: req.file.originalname,
    //   url: publicUrl
    // })

    // Wait for file to be saved into mongodb
    
    // const savedFile = await newFile.save();