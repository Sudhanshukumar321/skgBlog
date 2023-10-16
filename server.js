require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const DBConnection = require('./config/DB');

const app = express();

// db connection
DBConnection.Connect(); 

// middlewares(niche wale middleware ko direct route ke sath use kr liye hai isiliye ise comment kr diye hai).
// app.use('/api/v1',);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 8000;
// to specify which type of view engine is used(for example ejs is used here)
// view engine is used for rendering web pages
app.set('view engine','ejs');
// for accessing all views from admin routes
app.set('views','./views');

// make public folder as static folder for accessing all html,css,images...etc files at frontend side
app.use(express.static('public'));
// importing routes
const adminRoutes = require('./routes/admin');

app.use('/', adminRoutes);
const userRoute = require('./routes/user');
app.use('/', userRoute);
const blogRoute = require('./routes/blog');
app.use('/',blogRoute);
// error page
const { error } = require('./controllers/error');
app.get('/*',error);


app.listen(process.env.PORT,()=>{
    console.log('App listened at ',port)
})