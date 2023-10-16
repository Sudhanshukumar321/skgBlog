const nodemailer = require('nodemailer');
require('dotenv').config();

exports.mailSender = async (email,token) =>{
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass:   process.env.MAIL_PASS,
            }
        });

        const send = await transporter.sendMail({
            from:'codeTuber - by Sudhanshu Kumar ',
            to:email,
            subject:'Reset Password Link',
            html:`<p>Click here to reset your password: <a href='http://localhost:4000/resetPassword?token=${token}'>Reset</a></p>`,
        });
        console.log(send);
        return send;
    }catch(err){
        console.log(`Error During Mail Send`);
        console.log(err.message);
    }
}
