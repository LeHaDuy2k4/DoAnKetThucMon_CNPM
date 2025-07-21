const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "nhanvien", "docgia"], default: "docgia" }
});

module.exports = mongoose.model("Account", accountSchema);
