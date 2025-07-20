const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  matg: { type: String, required: true, unique: true },
  tentg: { type: String, required: true },
  namsinh: String,
  quequan: String
});

module.exports = mongoose.model('Author', authorSchema);
