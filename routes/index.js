const express = require("express");
const router = express.Router();
const {
    posts,
    addQuestion,
    userProfile,
    upVote,
    downVote,
} = require("../controllers/mainController.js");


//all users
router.route("/posts").get(posts);

// logged in users
router.route("/user/:username").get(userProfile);
router.route("/question").post(addQuestion);
router.route("/upVote").post(upVote);
router.route("/downVote").post(downVote);


module.exports = router;