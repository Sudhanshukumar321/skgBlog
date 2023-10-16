const express = require("express");
const { login, loggedIn, logout, forgetPassword, forgetPasswordEmail, resetPassword,resetPasswordSuccessfull, editProfile, editedProfile} = require("../controllers/user");
const route = express();

// express-session
const session = require("express-session");
const { isLogout, isLogin } = require("../middlewares/adminAuth");
route.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// make public folder as static folder for accessing all html,css,images...etc files at frontend side
route.use(express.static("public"));

// routes
route.get("/login", isLogout, login);
route.post("/login", loggedIn);
route.get("/logout", isLogin, logout);
route.get("/forgetPassword", isLogout, forgetPassword);
route.post("/forgetPassword", forgetPasswordEmail);
route.get("/resetPassword", isLogout, resetPassword);
route.post("/resetPassword", resetPasswordSuccessfull);
route.get("/editProfile", isLogin, editProfile);
route.post("/editProfile", editedProfile);


module.exports = route;
