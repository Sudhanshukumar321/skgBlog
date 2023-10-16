

exports.error = (req,res) =>{
    try {
        res.render('error');
    } catch (error) {
        console.log(`Error During Error Page rendering: ${error.message}` );
    }
};
