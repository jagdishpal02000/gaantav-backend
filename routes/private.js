const express = require("express");
const privateRoutes = express.Router();
const {addQuestion} = require('../controllers/question');
const {
    answer} = require('../controllers/answer');
const {
    upVote,
    downVote,
} = require("../controllers/mainController.js");

// logged in users

privateRoutes.route("/answer").post(answer);
privateRoutes.route("/question").post(addQuestion);
privateRoutes.route("/upVote").post(upVote);
privateRoutes.route("/downVote").post(downVote);


module.exports = privateRoutes;