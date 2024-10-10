const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

const passwordEncryption = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(`Error During Password Encryption: ${error.message}`);
  }
};

exports.signup = async (req, res) => {
  try {
    // const blogs = await BlogSetting.find({});
    // if(blogs.length > 0){
    //     res.redirect('/login');
    // }else{
    res.render("signup.ejs");
    // }
  } catch (error) {
    console.log(`Error During finding blogs in db at signup: ${error.message}`);
  }
};

exports.signedup = async (req, res) => {
  try {
    // data fetching from post request
    const { name, email, password, blogType, about } = req.body;
    const profileImage = req.file.filename;

    // password encryption
    const encryptedPassword = await passwordEncryption(password);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      blogType,
      about,
      profileImage: `/images/${profileImage}`,
      isAdmin: 1,
    });

    if (user) {
      res.redirect("/login");
    } else {
      res.render("blogSetup", { message: "Blog not setup, please try again" });
    }
  } catch (error) {
    console.log(`Error During file uploading: ${error.message}`);
  }
};

// dashboard controller
exports.dashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findById(userId);
      // console.log("user: ",user);
      if(user){
        const blogs = await Post.find({ createdBy: userId }).sort({
          createdAt: -1,
        });
        // console.log("blog: ",blogs);
        return res.render("admin/dashboard", { user: user, blogs: blogs });
      }
    }
    return res.render("/login");
  } catch (error) {
    console.log("Error During dashboard: ", error.message);
  }
};

// profile
exports.profile = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findById(userId);
      return res.render("admin/profile", { user: user });
    }
    return res.render("/login");
  } catch (error) {
    console.log("Error During dashboard: ", error.message);
  }
};

// create post
exports.createPost = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findById(userId);
      return res.render("admin/createPost", { user: user });
    }
    return res.render("/login");
  } catch (error) {
    console.log(`Error During creation post: ${error.message}`);
  }
};
// upload post
exports.uploadPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    // console.log("created data: ", req.body);
    const userId = req.session.userId;
    let image = '';
    if(req.file)
    {
      image = `/images/${req.file.filename}`;
    }
    
    if (userId) {
      const user = await User.findById(userId);
      const post = await Post.create({
        title: title,
        content: content,
        image: image,
        createdBy: userId,
      });
      if (post) {
        return res.render("admin/createPost", {
          message: "post is created sucessfully",
          user: user,
        });
      }
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(`Error During ulpoading post: ${error.message}`);
  }
};

// Edit blog
exports.editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    return res.render("editPost", { post: post });
  } catch (error) {
    console.log(`Error During showing edit post view: ${error.message}`);
  }
};

// Edited post
exports.editedPost = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      let image = "";
      let newImage = "";
      const { title, content } = req.body;
      console.log('body: ',req.body);
      const postId = req.params.id;
      // fetching old post data for deleting old image only
      const oldPost = await Post.findById(postId);
      const oldImage = oldPost.image;

      if(req.file){
        newImage = req.file.filename;
        
        if(oldImage != ''){
          // fs.unlinkSync(`F:/bharat-intern/Blog-management-tool/public${oldImage}`);
          fs.unlinkSync(path.join(__dirname,'..','public',oldImage));
          image = `/images/${newImage}`;
        }
      }else{
        image = oldImage;
      }
      
      
      const post = await Post.findByIdAndUpdate(
        { _id: postId },
        { title, content, image: image }
      );

      return res.redirect(`/post/${postId}`);
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(`Error During edited post: ${error.message}`);
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      console.log('post',post);
      await Post.findByIdAndDelete(postId);
      if(post.image != ''){
        // fs.unlinkSync(`F:/bharat-intern/Blog-management-tool/public${post.image}`);
        fs.unlinkSync(path.join(__dirname,'..','public',post.image));
      }

      return res.redirect("/dashboard");
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(`Error During showing edit post view: ${error.message}`);
  }
};

//edit profile image
exports.changeProfileImage = async(req,res) =>{
  try {
      const userId = req.session.userId;
      if(userId){
         return res.render('changeProfileImage');
      }
      return res.redirect('/login');
  } catch (error) {
      console.log('Error During changeProfileImage view: ',error.message);
  }
};

//edited profile controller
exports.changedProfileImage = async(req,res) =>{
  try {
      const profileImage = req.file.filename;
      // console.log('profile: ',profileImage)
      const userId = req.session.userId;
      if(userId){
       const user = await User.findById(userId);

        await User.findByIdAndUpdate({_id:userId},{profileImage: `/images/${profileImage}`})
         fs.unlinkSync(path.join(__dirname,'..','public',user.profileImage));
         return res.redirect('/profile');
      }
      return res.redirect('/login');

  } catch (error) {
      console.log('Error During changed Profile Image: ',error.message);
  }
};