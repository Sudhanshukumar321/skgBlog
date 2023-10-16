const express = require('express');
const { blogs, postDetails, contact, about} = require('../controllers/blogs');
const route = express();

route.use(express.static('public'));


route.get('/',blogs);
route.get('/post/:id',postDetails);
route.get('/contact',contact);
route.get('/about',about);



module.exports = route;