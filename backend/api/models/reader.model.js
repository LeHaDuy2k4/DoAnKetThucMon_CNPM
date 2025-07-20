const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema({
  madocgia: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hoten: {
    type: String,
    required: true,
    trim: true
  },
  ngaysinh: {
    type: Date,
    default: null
  },
  gioitinh: {
    type: String,
    enum: ["Nam", "Nữ", ""],
    default: ""
  },
  diachi: {
    type: String,
    default: ""
  },
  sdt: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Reader", readerSchema);
