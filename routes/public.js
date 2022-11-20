const express = require("express");
const publicRoutes = express.Router();
const {questions,question,searchQuestions} = require('../controllers/question');
const {answers} = require('../controllers/answer');
const {userProfile} = require('../controllers/user');
const {
    posts
} = require("../controllers/mainController.js");


//all users
// publicRoutes.route("/posts").get(posts);
publicRoutes.route("/search-questions/:query").get(searchQuestions);
publicRoutes.route("/questions/:page/:userId").get(questions);
publicRoutes.route("/questions/:page").get(questions);
publicRoutes.route("/questions").get(questions);
publicRoutes.route("/answers/:questionId").get(answers);
publicRoutes.route("/question/:questionTitle").get(question);
publicRoutes.route("/user/:username").get(userProfile);
module.exports = publicRoutes;