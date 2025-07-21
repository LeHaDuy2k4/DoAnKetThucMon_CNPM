const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  maphieu: { type: String, required: true, unique: true },
  madocgia: { type: String, required: true },
  masach: { type: String, required: true },
  tiencoc: { type: Number, required: true },
  borrowDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: { type: String, enum: ['open', 'closed', 'overdue'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model("Borrow", borrowSchema);
