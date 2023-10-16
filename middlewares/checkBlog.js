// const BlogSetting = require('../models/BlogSetting');

// exports.isBlog = async(req,res,next) =>{
//     try {
//         // data fetching from db to check blog is available or not
//         const blogs = await BlogSetting.find({});
//         // To stop apply middleware on blogSetup route we have to check url
//         if(blogs.length === 0 && req.originalUrl !== '/api/v1/blogSetup'){
//             res.redirect('/api/v1/blogSetup');
//         }else{
//             next();
//         }

//     } catch (error) {
//         console.log(`Error During Checking Blog: ${error}`);
//     }
// }