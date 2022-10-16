const mongoose = require("mongoose");

const saveUrlSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  url: {
    type: String,
    maxlength: 4000,
    required: true,
  },
  shortenUrl: { type: String, unique: true, required: true },
  clicks: { type: Number, default: 0 },
});

const saveUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
});

// now we will export the model
// with the upper schema
const saveURL = mongoose.model("saveURL", saveUrlSchema);
const users = mongoose.model("users", saveUserSchema);

module.exports = { saveURL, users };