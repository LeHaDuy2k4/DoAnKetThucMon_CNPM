const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  matra: { type: String, required: true },             
  madocgia: { type: String, required: true },
  tinhtrang: { type: String, enum: ["Bình thường", "Bị hỏng", "Mất sách"], required: true },
  maphat: { type: String, default: "" },
  returnDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
