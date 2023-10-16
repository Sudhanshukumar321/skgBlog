const Blog = require('../models/Post')

exports.blogs = async(req,res) =>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        const user = req.session.userId;
        return res.render('blogs',{blogs: blogs,user: user});
    } catch (error) {
        console.log(`Error During showing blogs: ${error.message}`);
    }
}

// single blog details controller
exports.postDetails = async(req,res) =>{
    try {
        const postId = req.params.id;
        // console.log(postId);
        const post =  await Blog.findById({_id:postId}).populate('createdBy');
        
        const user = req.session.userId;
        return res.render('post',{post: post,user: user});
        
    } catch (error) {
        console.log(`Error During showing post: ${error.message}`);
    }
}

// about
exports.about = async(req,res) =>{
    try {
        const user = req.session.userId;
        return res.render('about',{user: user});
    } catch (error) {
        console.log(`Error During rendering about: ${error.message}`);
    }
}

// contact
exports.contact = async(req,res) =>{
    try {
        const user = req.session.userId;
        return res.render('contact',{user: user});
    } catch (error) {
        console.log(`Error During rendering contact: ${error.message}`);
    }
}