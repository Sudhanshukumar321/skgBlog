const User = require('../models/User');
const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const { mailSender } = require('../config/mailsender');
require('dotenv').config();

exports.login = async(req,res) =>{
    try {
        // yha se login view me jayega
        res.render('login');
    } catch (error) {
       console.log(`Error During data filling: ${error.message}`); 
    }
};

exports.loggedIn = async(req,res) =>{
    try {
        // data fetching from login form
        const {email,password} = req.body;
        // fetching user data from db for checkin user is valid(or sign up) or not
        const user = await User.findOne({email});

        // checking user is valid or not
        if(user){
            // comparing user password and login form password
            const checkedPassword = await bcrypt.compare(password,user.password);
            // checking password is matched or not
            if(checkedPassword){
                // some data store in session storage
                req.session.userId = user._id;
                req.session.isAdmin = user.isAdmin;
                // checking user is admin or not
                if(user.isAdmin == 1){
                   return res.redirect('/api/v1/dashboard');
                }else{
                   return res.redirect('/api/v1/profile');
                }
            }else{
                res.render('login',{message: 'Email and Password is incorrect'});
            }
        }else{
            // ye sidha login view me le jayega aur message ko wahi get krenge
            res.render('login',{message: "Email and Password is incorrect"});
        }

    } catch (error) {
        console.log(`Error During Verifying Data: ${error.message}`);
    }
};

// logout controller
exports.logout = async(req,res) =>{
    try {
        
        req.session.destroy();
        res.redirect('/api/v1/login');

    } catch (error) {
        console.log(`Error During Logout: ${error.message}`);
    }
}

// forgot password controller
exports.forgetPassword = async(req,res) =>{
    try {
        res.render('forgetPassword');
    } catch (error) {
        console.log('Error During forget view randering: ',error.message);
    }
};

// forgot password email controller
exports.forgetPasswordEmail = async(req,res) =>{
    try {
        
        const {email} = req.body;

        const user = await User.findOne({email: email});

        if(user){
            const token = randomString.generate();
            await User.findOneAndUpdate({email},{token:token});
            const result = await mailSender(email,token);
            if(result){
               return res.render('forgetPassword',{message: 'Check Your Email To Reset Password',success: "true",});
            }else{
                return res.render('forgetPassword',{message: 'Something went wrong, please try again',success: "false"});

            }
        }else{
           return res.render('forgetPassword',{message: 'Invalid Email',success: "false"});
        }

    } catch (error) {
        console.log('Error During forget password email sending: ',error.message);
    }
};

// reset password
 exports.resetPassword = async(req,res) =>{
    try {
        const {token} = req.query;
        res.render('resetPassword',{token:token});
    } catch (error) {
        console.log('Error During reset password view randering: ',error.message);
    }
};

exports.resetPasswordSuccessfull = async(req,res) =>{
    try {
        const {password,token} = req.body;
        
        const encryptedpassword = await bcrypt.hash(password,10);
        const result = await User.findOneAndUpdate({token},{password:encryptedpassword,token:''});

        return res.redirect('/api/v1/login');
        
    } catch (error) {
        console.log('Error During reseting password: ',error.message);
    }
};


//edit profile controller
exports.editProfile = async(req,res) =>{
    try {
        const userId = req.session.userId;
        if(userId){
            const user = await User.findById(userId);
           return res.render('editProfile',{user: user});
        }
        return res.redirect('/api/v1/login');
    } catch (error) {
        console.log('Error During Profile editing view: ',error.message);
    }
};

//edited profile controller
exports.editedProfile = async(req,res) =>{
    try {
        const {name,about} = req.body;
        const userId = req.session.userId;
        if(userId){
            const updatedUser = await User.findByIdAndUpdate({_id:userId},{name,about});
           res.redirect('/api/v1/profile');
        }
        res.redirect('/api/v1/login');

    } catch (error) {
        console.log('Error During Profile editing: ',error.message);
    }
};

