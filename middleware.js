module.exports.catchAsyncError = (fn) => { // it takes an async function, so argument is a function
    return (req, res, next) => {
        fn(req,res,next).catch(e => next(e));
    }
}

class ExpressError extends Error {
    constructor(message,status){
        super();
        this.message = message;
        this.status = status || 404 ;  
    }
}
module.exports.ExpressError = ExpressError;

module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){ // 'isAuthenticated' is added to request object by passport.
        // req.flash('error', 'Login to view resource');
       return res.redirect('/users/login');
    }
    else  next();
}
