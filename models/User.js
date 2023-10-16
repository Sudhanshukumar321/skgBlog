const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    blogType:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: String,
        required: true,
    },
},{timestamps: true});

module.exports = mongoose.model('user',userSchema);
