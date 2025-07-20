const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  maTheLoai: { type: String, required: true, unique: true },
  tenTheLoai: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);
