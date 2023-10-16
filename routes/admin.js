const express = require('express');
const route = express();

// multer (it is used for uploading images/files)
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req,file,callback){
        // to tell where you want to store all images
        // null is for no error(i.e error = null)
        callback(null,path.join(__dirname,'../public/images'));
    },
    filename: function(req,file,callback){
        // define custom file name
        const fileName = Date.now() + '-' + file.originalname;
        // set name
        // null is for no error(i.e error = null)
        callback(null,fileName);
    },
});
const upload = multer({storage: storage});

// express-session
const session = require("express-session");
const {  isLogin, isLogout } = require("../middlewares/adminAuth");
route.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const {signedup,signup, dashboard,createPost,uploadPost,profile, editPost,editedPost,deletePost, changeProfileImage, changedProfileImage} = require('../controllers/admin');
route.get('/signup',isLogout, signup);
route.post('/signup',upload.single('profileImage'),signedup);
route.get('/dashboard',isLogin, dashboard);
route.get('/profile',isLogin, profile);
route.get('/createPost',isLogin, createPost);
route.post('/createPost',upload.single('image'), uploadPost);
route.get('/editPost/:id',isLogin, editPost);
route.post('/editPost/:id',upload.single('image'), editedPost);
route.get('/deletePost/:id',isLogin, deletePost);
route.get("/changeProfileImage", isLogin, changeProfileImage);
route.post("/changeProfileImage",upload.single('profileImage'), changedProfileImage);

module.exports = route;