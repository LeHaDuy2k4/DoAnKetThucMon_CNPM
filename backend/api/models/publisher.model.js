// publisher.model.js
const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  manxb: String,
  tennxb: String,
  diachi: String,
  sdt: String
});

module.exports = mongoose.model('Publisher', publisherSchema);
