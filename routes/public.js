const express = require("express");
const publicRoutes = express.Router();
const {questions,question} = require('../controllers/question');
const {answers} = require('../controllers/answer');
const {userProfile} = require('../controllers/user');
const {asmtReport} = require('../controllers/asmt');
const {
    posts
} = require("../controllers/mainController.js");


//all users
// publicRoutes.route("/posts").get(posts);
publicRoutes.route("/questions/:page").get(questions);
publicRoutes.route("/questions").get(questions);
publicRoutes.route("/answers/:questionId").get(answers);
publicRoutes.route("/question/:questionTitle").get(question);
publicRoutes.route("/user/:username").get(userProfile);
publicRoutes.route("/asmt-report/:asmt_type").get(asmtReport);
module.exports = publicRoutes;