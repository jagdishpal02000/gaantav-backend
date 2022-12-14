const express = require("express");
const authRouter = express.Router();
const {
    signup,
    login,
} = require("../controllers/auth");

//auth
authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);

module.exports = authRouter;