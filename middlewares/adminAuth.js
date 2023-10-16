exports.isLogin = async(req,res,next) =>{
    try{
        if(req.session.userId && req.session.isAdmin == 1){

        }else{
           return res.redirect('/login');
        }
        next();

    }catch(error){
        console.log(`Error During admin logging: ${error.message}`);
    }
};

exports.isLogout = async(req,res,next) =>{
    try{
        if(req.session.userId && req.session.isAdmin == 1){
           return res.redirect('/dashboard');   
        }
        next();

    }catch(error){
        console.log(`Error During admin logout: ${error.message}`);
    }
};