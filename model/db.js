const mongoose = require("mongoose");
require("dotenv").config();

const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const connectDBString = `mongodb+srv://${username}:${password}@cluster0.unao6.mongodb.net/urlShortner?retryWrites=true&w=majority`;

const conncetDB = () => {
  return mongoose.connect(connectDBString);
};

module.exports = conncetDB;