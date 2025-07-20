const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
  maphat: { type: String, required: true, unique: true },
  matra: { type: String, required: true },
  tienphat: { type: Number, required: true },
  lydo: { type: String, required: true }
});

module.exports = mongoose.model("Fine", fineSchema);
