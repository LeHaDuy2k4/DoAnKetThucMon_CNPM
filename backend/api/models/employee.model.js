const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  manv: { type: String, required: true, unique: true },
  hoten: { type: String, required: true },
  diachi: { type: String },
  sdt: { type: String }
});

module.exports = mongoose.model('Employee', employeeSchema);
