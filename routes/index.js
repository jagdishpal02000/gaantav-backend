const express = require("express");
const router = express.Router();
const {
    posts,
    addQuestion,
    signup,
    login,
} = require("../controllers/mainController.js");

router.route("/posts").get(posts);
router.route("/question").post(addQuestion);
router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports = router;